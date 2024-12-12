function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => (typeof child === 'object' ? child : createTextElement(child))),
    },
  };
}

function render() {
  //todo
}

function createTextElement(text: string) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    },
  };
}
const Rifle = {
  createElement,
};

const element = Rifle.createElement('div', { id: 'foo' }, 'Hello ', Rifle.createElement('b', null, 'world'), '!');
