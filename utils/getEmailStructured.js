function getEmailStructured(link, heading, title, id) {
  return `
    <div>
      <h1>${heading}</h1>
      <a href="http://${link}/${id}">${title}</a>
    </div>`;
}

module.exports = getEmailStructured;
