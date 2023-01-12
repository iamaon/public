export const ID = (obj) => {
    return document.getElementById(obj)
}

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
        if (attr.nodeName !== 'id') {
            b.setAttribute(attr.nodeName, attr.nodeValue)
        }
    })
}

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

export const rndNP = (v) => {
    const np = Math.ceil((Math.random() - 0.5) * 2) < 1 ? -1 : 1;
    return Math.round(Math.random() * v * np)
}

export const rndRange = (min, max) => {
    return Math.round(Math.random() * (max - min) + min);
}

export const millisToDays = (millis) => {
    return millis / (60 * 60 * 24 * 1000)
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

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

HTMLElement.prototype.QSL = function (t, cb) {
    const target = this.querySelector(t)
    if (cb && typeof (cb) === "function") cb(target)
    return target
}

HTMLElement.prototype.QSLA = function (t, cb) {
    const target = this.querySelectorAll(t)
    if (cb && typeof (cb) === "function") cb(target)
    return target
}

HTMLElement.prototype.isLoaded = async function () {
    while (this === null) {
        await new Promise(resolve => requestAnimationFrame(resolve))
    }
    return this;
}

HTMLElement.prototype.getSum = async function (s) {
    let d = 0
    const t = this.QSLA(s, (m) => {
        d = [...m].map(i => +(i.value)).reduce((a, b) => a + b, 0)
    })
    return Math.floor(d / t.length)
}
