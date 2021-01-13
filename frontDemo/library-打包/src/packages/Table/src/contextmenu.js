const cssText = 'position:fixed;pointer-events:none;z-index:-9999;opacity:0;';

function getParent(el, classNameOrTag) {
  if (
    el.classList.contains(classNameOrTag) ||
    el.tagName === classNameOrTag.toUpperCase()
  ) {
    return el;
  } else {
    return getParent(el.parentElement, classNameOrTag);
  }
}

function getColIndex(el) {
  let td = getParent(el, 'td');
  let colIndex = td.classList[0].split('_').pop();
  let firstIndex = td.parentElement.firstElementChild.classList[0]
    .split('_')
    .pop();
  return parseInt(colIndex) - parseInt(firstIndex);
}

export function showContextMenu(row, column, event) {
  if (column.type !== 'default' || column.label === '操作') return false;
  event.preventDefault();
  let rowEl = getParent(event.srcElement, 'el-table__row');
  let checkboxEl = rowEl.firstElementChild.querySelector('.el-checkbox');
  const config = {
    items: [
      {
        label: '复制',
        onClick: () => {
          setClipboard(event.srcElement.innerText);
        }
      },
      {
        label: '复制整行',
        onClick: () => {
          setClipboard(getRowData(row));
        }
      },
      {
        label: '复制整列',
        onClick: () => {
          setClipboard(getColData(event.srcElement));
        }
      },
      {
        label: '复制表格',
        onClick: () => {
          setClipboard(getTableData(event.srcElement));
        }
      }
    ],
    event,
    //x: event.clientX,
    //y: event.clientY,
    // customClass: 'class-a',
    zIndex: 30,
    minWidth: 160
  };
  if (checkboxEl) {
    config.items.push({
      label: '复制勾选数据',
      onClick: () => {
        setClipboard(getCheckedData(event.srcElement));
      }
    });
  }
  window.app.$contextmenu(config);
  return false;
}

/*获取行数据*/
function getRowData(row) {
  let td = row.firstElementChild;
  let values = [];
  while (td) {
    /*普通列*/
    if (!td.classList.contains('no-copy')) {
      values.push(td.innerText);
    }
    td = td.nextElementSibling;
  }
  return values.join('\t');
}
/*获取列数据*/
function getColData(el) {
  let colIndex = getColIndex(el);
  let row = getParent(el, 'tbody').firstElementChild;
  let values = [];
  while (row) {
    values.push(row.children[colIndex].innerText);
    row = row.nextElementSibling;
  }
  return values.join('\n');
}
/*复制表格*/
function getTableData(el) {
  let tbody = getParent(el, 'tbody');
  let row = tbody.firstElementChild;
  let values = [];
  while (row) {
    values.push(getRowData(row));
    row = row.nextElementSibling;
  }
  return values.join('\n');
}

/*复制勾选数据*/
function getCheckedData(el) {
  let tbody = getParent(el, 'tbody');
  let row = tbody.firstElementChild;
  let values = [];
  while (row) {
    if (row.firstElementChild.querySelector('.el-checkbox.is-checked')) {
      values.push(getRowData(row));
    }
    row = row.nextElementSibling;
  }
  return values.join('\n');
}

export function setClipboard(value) {
  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.cssText = cssText;
  document.body.appendChild(textarea);
  if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
    textarea.contentEditable = true;
    textarea.readOnly = true;
    const range = document.createRange();
    range.selectNodeContents(textarea);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    textarea.setSelectionRange(0, 999999);
  } else {
    textarea.select();
  }
  try {
    document.execCommand('copy');
  } catch (err) {
    console.warn(err);
  }
  document.body.removeChild(textarea);
}
