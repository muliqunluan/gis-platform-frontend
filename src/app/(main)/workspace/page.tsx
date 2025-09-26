'use client';

import HexMapTest from '@/components/hex-map-test/HexMapTest';
import UserInputDisplay from '@/components/molecules/UserInputDisplay/UserInputDisplay';
export default function WorkspacePage() {
  return (
    <div className="flex w-full h-full">
      <UserInputDisplay></UserInputDisplay>
    </div>
  );
}