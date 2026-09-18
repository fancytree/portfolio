'use client';

// Hero 里的粒子鱼：在卡片里巡游，指针在卡片上移动时镜头绕着鱼转，移开就回正。

import HeroFish from '@/app/components/HeroFish';

export default function ParticleFish() {
  return <HeroFish pointerScope="self" />;
}
