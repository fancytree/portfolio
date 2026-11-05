// 3D 工作台：独立的 three.js 页面，嵌入卡片内直接交互。
export default function DesignerWorkstation() {
  return (
    <iframe
      src="/play/designer-workstation/index.html?embed"
      title="Designer Workstation, an interactive 3D scene"
      loading="lazy"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0, display: 'block' }}
    />
  );
}
