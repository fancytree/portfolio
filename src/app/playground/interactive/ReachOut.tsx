// 页脚的 "Reach out" 转圈徽章：橙色底，徽章居中，点击发邮件。

import ReachOutBadge from '@/app/components/ReachOutBadge';

export default function ReachOut() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', background: '#ed5b2b' }}>
      <ReachOutBadge style={{ width: '56%', aspectRatio: '1' }} />
    </div>
  );
}
