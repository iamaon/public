export const ID = (obj) => {
    return document.getElementById(obj)
}

// qsl = queryselector
export const QSL = (obj) => {
    return document.querySelector(obj)
}

export const QSLA = (obj) => {
    return document.querySelectorAll(obj)
}

export const ce = (e) => {
    return document.createElement(e)
}

export const lzEl = (e, t, opt, ds) => {
    const el = ce(e)
    if (t && t.length > 0) el.textContent = t
    if (opt) {
        for (const [k, v] of Object.entries(opt)) {
            el.setAttribute(k, v)
        }
    }
    
    if (ds && Object.keys(ds)[0] === "dataset") {
        for (const [k, v] of Object.entries(ds.dataset)) {
            el.dataset[k] = v
        }
    }
    return el
}

export const bindEvent = (q, e, f, l) => {
    q.addEventListener(e, f, l | false)
}

export const setDp = (el, v) => el.style.display = v

export const cloneAttr = (a, b) => {
    [...a.attributes].forEach(attr => {
        //Clone ทุกอย่าง ยกเว้น id
        if (attr.nodeName !== 'id') {
            b.setAttribute(attr.nodeName, attr.nodeValue)
        }
    })
}

//populate Select เพื่อลด code ฝั่ง html 
export const populateSelect = (sl, list, useIndex, display) => {
    sl.innerHTML = ""
    list.forEach((t, i) => {
        let opt = document.createElement("option")
        opt.value = useIndex ? typeof (t) === "object" ? t.id : i : t
        opt.appendChild(document.createTextNode(typeof (t) === "object" ? t[display] : t))

        sl.appendChild(opt)
    })
}

export const floorz = (num) => {
    if (num <= 0 || Number.isNaN(num)) {
        return 0
    } else {
        return Math.floor(num)
    }
}

export const roundz = (num) => {
    if (num <= 0 || Number.isNaN(num)) {
        return 0
    } else {
        return Math.round(num)
    }
}

export const storeLocalData = (outData, prefixKey) => {
    const items = { ...localStorage }
    let count = 0

    for (k in items) {
        if (k.includes(prefixKey)) {
            count++
        }
    }
    window.localStorage.setItem(`${prefixKey}${count}`, JSON.stringify(outData))
}

export const compare = (a, b, key) => {
    return a[key] - b[key]
}

export const sumz = (arr, key) => {
    if (Array.isArray(arr) && arr.length > 0) {
        return arr.map(item => +item[key]).reduce((p, c) => p + c, 0)
    } else {
        return 0
    }
}

export const minz = (arr, key) => {
    if (Array.isArray(arr) && arr.length > 0) {
        return arr.map(item => +item[key]).reduce((p, c) => p < c ? p : c)
    } else {
        return 0
    }
}

export const maxz = (arr, key) => {
    if (Array.isArray(arr) && arr.length > 0) {
        return arr.map(item => +item[key]).reduce((p, c) => p > c ? p : c)
    } else {
        return 0
    }
}

export const range = (size, startAt = 0) => {
    return [...Array(size).keys()].map(i => i + startAt);
}

export const loadCssFile = async (f) => {
    const opt = { rel: "stylesheet", type: "text/css", href: f }
    const link = document.createElement('link')
    Object.assign(link, opt)
    document.getElementsByTagName('HEAD')[0].appendChild(link)
}

export const buildStyle = (opt) => {
    const styleSheet = document.styleSheets[0]
    styleSheet.insertRule(opt, styleSheet.cssRules.length)
}

export const KEYS = {
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

Object.defineProperty(Object.prototype, 'kv', {
    writable: false,
    configurable: false,
    value: function (cb) {
        const entries = Object.entries(this)
        if (cb) {
            for (const [k, v] of entries) {
                cb(k, v)
            }
        }
        return entries
    }
})
