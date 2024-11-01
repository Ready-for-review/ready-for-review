export function version() {
  return String(Date.now());
}

export function episodeContent(item) {
  return `${item["content:encoded"]}`;
}

export function buildInfo() {
  return `Version ${process.env.npm_package_version}`;
}

export function ingredient({ name, quantity, units }) {
  if (isNaN(quantity)) {
    return name;
  } else {
    return `${name}, ${quantity} ${units ? units : ""} `;
  }
}
