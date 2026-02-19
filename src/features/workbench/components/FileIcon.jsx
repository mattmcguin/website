import { iconClassForPath, iconImageForPath } from '../utils/fileUtils.js';

export default function FileIcon({ path, className = '' }) {
  const imageIcon = iconImageForPath(path);

  if (imageIcon) {
    return (
      <img
        src={imageIcon}
        alt=""
        aria-hidden="true"
        className={`file-icon file-icon-image ${className}`.trim()}
      />
    );
  }

  return <span className={`${iconClassForPath(path)} ${className}`.trim()} aria-hidden="true" />;
}
