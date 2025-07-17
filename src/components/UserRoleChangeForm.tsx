'use client'

import { useState, useEffect } from 'react';
let debounceTimer: NodeJS.Timeout;
export default function UserRoleChangeForm() {
    const [email, setEmail] = useState('');
    const [roles, setRoles] = useState<string[]>([]);
    const [allRoles, setAllRoles] = useState<string[]>([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // 获取所有可用角色
    useEffect(() => {
        fetch('http://localhost:3001/roles')
            .then((res) => res.json())
            .then((data) => {
                setAllRoles(data); // 假设后端返回 ['admin', 'user', 'moderator']
            })
            .catch((err) => {
                console.error('Failed to fetch roles', err);
                setError('无法加载角色列表');
            });
    }, []);

    // 输入邮箱后，获取该用户当前角色
    async function fetchUserRoles(userEmail: string) {
        try {
            const res = await fetch(`http://localhost:3001/users/${userEmail}/roles`);
            if (!res.ok) throw new Error('用户不存在或获取角色失败');
            const data = await res.json(); // 假设返回 ['user']
            console.log(data)
            setRoles(data);
            setError('');
        } catch (err) {
            console.error(err);
            setError('获取用户角色失败');
            setRoles([]);
        }
    }

    // 监听 email 输入并延迟获取用户角色
    // useEffect(() => {
    //     if (!email) return;

    //     // 防抖处理：输入停止 500ms 后才触发
    //     debounceTimer && clearTimeout(debounceTimer);
    //     debounceTimer = setTimeout(() => {
    //         fetch(`http://localhost:3001/users/${email}/roles`)
    //             .then(res => {
    //                 if (!res.ok) throw new Error('Failed');
    //                 return res.json();
    //             })
    //             .then(setRoles)
    //             .catch(() => {
    //                 setRoles([]);
    //                 setError('❌ 无法获取该用户的角色');
    //             });
    //     }, 500);

    //     return () => clearTimeout(debounceTimer);
    // }, [email]);

    // 输入邮箱框失焦时拉取角色
    const handleEmailBlur = () => {
        if (email) {
            fetchUserRoles(email);
        }
    };

    const handleRoleChange = (role: string) => {
        setRoles((prev) => (prev.includes(role) ? prev : [...prev, role]));
    };

    const removeRole = (role: string) => {
        setRoles((prev) => prev.filter((r) => r !== role));
    };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email || !roles.length) {
        setError('请填写邮箱并选择至少一个角色');
        return;
    }

    try {
        const res = await fetch(`http://localhost:3001/users/${email}/roles`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ roles }), // 传递的是角色名称数组
        });

        const data = await res.json();

        if (res.ok) {
            setMessage('✅ 用户角色更新成功');
        } else {
            setError(data.message || '❌ 更新失败');
        }
    } catch (err) {
        console.error(err);
        setError('服务器请求失败');
    }
};

    return (
        <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-md border">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">用户角色管理</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                        用户邮箱
                    </label>
                    <input
                        id="email"
                        type="email"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="example@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={handleEmailBlur}
                        required
                    />
                </div>

                {allRoles.length > 0 && (
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">可选角色</label>
                        <div className="flex flex-wrap gap-2">
                            {allRoles.map((role) => (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => handleRoleChange(role)}
                                    disabled={roles.includes(role)}
                                    className={`px-3 py-1 rounded-full text-sm border ${roles.includes(role)
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                        }`}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {roles.length > 0 && (
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">已分配角色</label>
                        <div className="flex flex-wrap gap-2">
                            {roles.map((role) => (
                                <span
                                    key={role}
                                    className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                                >
                                    {role}
                                    <button
                                        type="button"
                                        onClick={() => removeRole(role)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        &times;
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        更新角色
                    </button>
                </div>
            </form>

            {message && <p className="mt-4 text-green-600 text-sm">{message}</p>}
            {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}
        </div>
    );
}
