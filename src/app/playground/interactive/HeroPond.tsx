'use client';

// 首页 Hero 的池塘原样搬进卡片：岛、水草、鱼群、波纹、泡泡全都一样。
// 卡片比 Hero 小得多，整片池塘缩进来会看不清，所以放大一些、镜头对准小岛一带。

import { InteractivePond } from '@/app/components/InteractivePond';

export default function HeroPond() {
  return <InteractivePond className="block" zoom={1.45} focus={{ x: 880, y: 480 }} />;
}
