export default function Container({ classname = "", children, maxWidth }) {
  return (
    <div className={classname} style={{ maxWidth: maxWidth || undefined }}>
      {children}
    </div>
  );
}
