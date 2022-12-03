//ทำ Function เพื่อลดการ code (จริงๆ ไม่ค่อยจำเป็นเท่าไหร่)

const ID = (obj) => {
    return document.getElementById(obj)
}

// qsl = queryselector
const QSL = (obj) => {
    return document.querySelector(obj)
}

const QSLA = (obj) => {
    return document.querySelectorAll(obj)
}

const bindEvent = (q, e, f, l) => {
    q.addEventListener(e, f, l | false)
}

const cloneAttr = (a, b) => {
    [...a.attributes].forEach(attr => {
        //Clone ทุกอย่าง ยกเว้น id
        if (attr.nodeName !== 'id') {
            b.setAttribute(attr.nodeName, attr.nodeValue)
        }
    })
}

//populate Select เพื่อลด code ฝั่ง html 
const populateSelect = (sl, list, useIndex, display) => {
    sl.innerHTML = ""
    list.forEach((t, i) => {
        let opt = document.createElement("option")
        opt.value = useIndex ? typeof(t) === "object" ? t.id : i : t
        opt.appendChild(document.createTextNode(typeof(t) === "object" ? t[display]: t))

        sl.appendChild(opt)
    })
}

const floorz = (num) => {
    if (num <= 0 || Number.isNaN(num)) {
        return 0
    } else {
        return Math.floor(num)
    }
}

const roundz = (num) => {
    if (num <= 0 || Number.isNaN(num)) {
        return 0
    } else {
        return Math.round(num)
    }
}

const storeLocalData = (outData, prefixKey) => {
    const items = { ...localStorage }
    let count = 0

    for (k in items) {
        if (k.includes(prefixKey)) {
            count++
        }
    }
    window.localStorage.setItem(`${prefixKey}${count}`, JSON.stringify(outData))
}

const compare = (a, b, key) => {
    return a[key] - b[key]
} 

const sumz = (arr, key) => {
    if (Array.isArray(arr) && arr.length > 0) {
        return arr.map(item => +item[key]).reduce((p, c) => p + c, 0)
    } else {
        return 0
    }
}

const minz = (arr, key) => {
    if (Array.isArray(arr) && arr.length > 0) {
        return arr.map(item => +item[key]).reduce((p, c) => p < c ? p : c)
    } else {
        return 0
    }
}

const maxz = (arr, key) => {
    if (Array.isArray(arr) && arr.length > 0) {
        return arr.map(item => +item[key]).reduce((p, c) => p > c ? p : c)
    } else {
        return 0
    }
}

const range = (size, startAt = 0) => {
    return [...Array(size).keys()].map(i => i + startAt);
}

const KEYS = {
    ENTER: "Enter",
    TAB: "Tab",
    CAPS: "CapsLock",
    BACKSPACE: "Backspace",
    SPACE: "Space",
    ARROW_UP: "ArrowUp",
    ARROW_DOWN: "ArrowDown",
    ARROW_RIGHT: "ArrowRight",
    ARROW_LEFT: "ArrowLeft"
}
