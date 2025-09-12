// ==========================================================================================
//
//                  六边形地图核心逻辑 - 蓝图参考代码
//
// 本文件包含了构建和操作六边形地图所需的所有核心算法和数据结构。
// 你可以参考这里的逻辑，在UE4等游戏引擎中创建对应的蓝图函数库和数据结构体。
//
// ==========================================================================================


// ------------------------------------------------------------------------------------------
// [数据结构] - 对应蓝图中的 `Struct`
// ------------------------------------------------------------------------------------------

/**
 * [蓝图参考]：可以创建一个名为 `Vector2D` 或 `WorldPosition` 的结构体。
 * 作用：表示世界坐标系中的一个点（例如，UE4中的世界位置）。
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * [蓝图参考]：可以创建一个名为 `HexCoordQR` 的结构体。
 * 作用：表示六边形在网格中的逻辑坐标（使用轴向坐标系 Axial Coordinates）。这是地图的核心坐标系统。
 */
export interface QRCoord {
  q: number;
  r: number;
}


// ------------------------------------------------------------------------------------------
// [核心算法] - 对应蓝图中的 `Blueprint Function Library`
// ------------------------------------------------------------------------------------------

/**
 * [蓝图参考]：创建一个名为 `WorldToHex` 的蓝图函数。
 * 输入：世界坐标 (Point/Vector2D), 六边形大小 (Float)
 * 输出：六边形坐标 (QRCoord)
 * 作用：将给定的世界坐标转换为其所在的六边形网格的逻辑坐标。这对于处理鼠标点击、角色位置等非常关键。
 */
export function worldToQR(p: Point, size: number): QRCoord {
  // 这是从世界坐标(x, y)到轴向坐标(q, r)的转换矩阵运算
  const q = (Math.sqrt(3) / 3 * p.x - 1 / 3 * p.y) / size;
  const r = (2 / 3 * p.y) / size;
  return { q, r };
}

/**
 * [蓝图参考]：创建一个名为 `HexToWorld` 的蓝图函数。
 * 输入：六边形坐标 (QRCoord), 六边形大小 (Float)
 * 输出：世界坐标 (Point/Vector2D)
 * 作用：将六边形的逻辑坐标转换为其在世界空间中的中心点位置。这对于在场景中生成或移动六边形Actor非常关键。
 */
export function qrToWorld(qr: QRCoord, size: number): Point {
    // 这是从轴向坐标(q, r)到世界坐标(x, y)的转换矩阵运算
    const x = size * (Math.sqrt(3) * qr.q + Math.sqrt(3) / 2 * qr.r);
    const y = size * (3 / 2 * qr.r);
    return { x, y };
}


// ------------------------------------------------------------------------------------------
// [核心对象] - 对应蓝图中的 `Blueprint Class` 或 `Struct`
// ------------------------------------------------------------------------------------------

/**
 * [蓝图参考]：创建一个名为 `HexTile` 的结构体或蓝图类。
 * 作用：表示地图上的一个六边形单元。它包含逻辑坐标，并可以扩展存储其他游戏数据（如地形类型、是否为障碍物等）。
 */
export class Hex implements QRCoord {
  q: number;
  r: number;
  isObstacle: boolean; // 示例：是否为障碍物

  constructor(q: number, r: number, isObstacle = false) {
    this.q = q;
    this.r = r;
    this.isObstacle = isObstacle;
  }

  // 在蓝图中，你可能需要一个函数来生成一个唯一的字符串或ID，用于在Map/Dictionary中作为键。
  toString(): string {
    return `${this.q},${this.r}`;
  }
}

/**
 * [蓝图参考]：创建一个名为 `HexGraph` 或 `HexMapData` 的蓝图类或Actor。
 * 作用：这是整个地图的数据中心。它存储了所有的六边形单元，并提供了查询邻居等核心功能。
 * 在UE4中，这可能是一个 `Actor` 或 `ActorComponent`，持有一个 `TMap<FString, UHexTile*>`。
 */
export class Graph {
  // 存储地图上所有的六边形单元，通过坐标字符串快速查找。
  // [蓝图参考]：对应一个 `TMap<FString, HexTile>` 变量。
  hexes: Map<string, Hex> = new Map();

  constructor(hexes: Hex[] = []) {
    for (const hex of hexes) {
      this.hexes.set(hex.toString(), hex);
    }
  }

  // 根据QR坐标获取一个六边形单元。
  getHex(qr: QRCoord): Hex | undefined {
    return this.hexes.get(`${qr.q},${qr.r}`);
  }

  // 定义了六个方向的向量，用于查找邻居。这是一个常量，可以在蓝图中定义为一个静态数组。
  static directions = [
    { q: 1, r: 0 }, { q: 1, r: -1 }, { q: 0, r: -1 },
    { q: -1, r: 0 }, { q: -1, r: 1 }, { q: 0, r: 1 },
  ];

  /**
   * [蓝图参考]：创建一个名为 `GetNeighbors` 的函数。
   * 输入：一个六边形单元 (HexTile)
   * 输出：一个六边形单元数组 (Array of HexTile)
   * 作用：获取给定六边形的所有有效（非障碍物）邻居。这是寻路算法的基础。
   */
  getNeighbors(hex: Hex): Hex[] {
    const neighbors: Hex[] = [];
    for (const dir of Graph.directions) {
      const neighborQR = { q: hex.q + dir.q, r: hex.r + dir.r };
      const neighborHex = this.getHex(neighborQR);
      // 检查邻居是否存在且不是障碍物
      if (neighborHex && !neighborHex.isObstacle) {
        neighbors.push(neighborHex);
      }
    }
    return neighbors;
  }
}


// ------------------------------------------------------------------------------------------
// [地图生成与寻路] - 对应蓝图中的 `Blueprint Function Library`
// ------------------------------------------------------------------------------------------

/**
 * [蓝图参考]：创建一个名为 `GenerateRectangleMap` 的函数。
 * 输入：地图宽度 (Integer), 地图高度 (Integer)
 * 输出：一个六边形单元数组 (Array of HexTile)
 * 作用：生成一个近似矩形的六边形网格地图。
 */
export function generateRectangleMap(width: number, height: number): Hex[] {
  const hexes: Hex[] = [];
  for (let r = 0; r < height; r++) {
    // 每隔一行，进行偏移，以形成紧凑的六边形布局
    const rOffset = Math.floor(r / 2);
    for (let q = -rOffset; q < width - rOffset; q++) {
      hexes.push(new Hex(q, r));
    }
  }
  return hexes;
}

/**
 * [蓝图参考]：创建一个名为 `Heuristic_HexDistance` 的函数。
 * 输入：两个六边形单元 (HexTile A, HexTile B)
 * 输出：估算距离 (Float)
 * 作用：A*算法的启发函数，用于估算两个六边形之间的距离。
 */
function heuristic(a: Hex, b: Hex): number {
  // 这是轴向坐标系下的曼哈顿距离
  return (Math.abs(a.q - b.q)
        + Math.abs(a.q + a.r - b.q - b.r)
        + Math.abs(a.r - b.r)) / 2;
}

/**
 * [蓝图参考]：创建一个名为 `FindPath_AStar` 的函数。
 * 输入：图数据 (HexGraph), 起点 (HexTile), 终点 (HexTile)
 * 输出：路径数组 (Array of HexTile)
 * 作用：经典的A*寻路算法实现。这是所有寻路功能的核心。
 */
export function aStar(graph: Graph, start: Hex, goal: Hex): Hex[] | null {
  // 开放列表，存储待评估的节点
  const openSet = new Map<string, Hex>();
  openSet.set(start.toString(), start);

  // 记录路径，用于最终回溯
  const cameFrom = new Map<string, Hex>();

  // gScore: 从起点到当前节点的实际成本
  const gScore = new Map<string, number>();
  gScore.set(start.toString(), 0);

  // fScore: gScore + 启发函数hScore，节点的总评估成本
  const fScore = new Map<string, number>();
  fScore.set(start.toString(), heuristic(start, goal));

  while (openSet.size > 0) {
    // 在开放列表中找到fScore最低的节点
    let current: Hex | undefined;
    let lowestFScore = Infinity;
    for (const hex of openSet.values()) {
      const score = fScore.get(hex.toString()) ?? Infinity;
      if (score < lowestFScore) {
        lowestFScore = score;
        current = hex;
      }
    }

    if (!current) break;

    // 如果到达终点，则回溯路径并返回
    if (current.toString() === goal.toString()) {
      const path: Hex[] = [current];
      let temp = current;
      while (cameFrom.has(temp.toString())) {
        temp = cameFrom.get(temp.toString())!;
        path.unshift(temp);
      }
      return path;
    }

    // 将当前节点从开放列表移到关闭列表（通过删除实现）
    openSet.delete(current.toString());

    // 遍历所有邻居
    for (const neighbor of graph.getNeighbors(current)) {
      // 计算从起点经过当前节点到达邻居的gScore
      const tentativeGScore = (gScore.get(current.toString()) ?? Infinity) + 1; // 假设每步成本为1

      // 如果这条路径更优
      if (tentativeGScore < (gScore.get(neighbor.toString()) ?? Infinity)) {
        // 更新路径和分数
        cameFrom.set(neighbor.toString(), current);
        gScore.set(neighbor.toString(), tentativeGScore);
        fScore.set(neighbor.toString(), tentativeGScore + heuristic(neighbor, goal));
        // 如果邻居不在开放列表中，则添加进去
        if (!openSet.has(neighbor.toString())) {
          openSet.set(neighbor.toString(), neighbor);
        }
      }
    }
  }

  return null; // 未找到路径
}