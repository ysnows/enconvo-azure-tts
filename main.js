function init_data(source_lang, target_lang) {
    return {
        "source": "",
        "detect": true,
        "os_type": "ios",
        "device_id": "F1F902F7-1780-4C88-848D-71F35D88A602",
        "trans_type":  'auto2' + target_lang,
        "media": "text",
        "request_id": 424238335,
        "user_id": "",
        "dict": true
    };
}

function getRandomNumber() {
    const rand = Math.floor(Math.random() * 99999) + 100000;
    return rand * 1000;
}


function sleep(delay) {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log("hello")
            resolve("world")
        }, 1000);
    })
}

async function translate(query) {

    var source_lang = 'en';
    var target_lang = 'zh';
    const translate_text = query || '';

    console.log("begin")

    if (translate_text !== '') {
        source_lang = await $lang.detect(translate_text)
        console.log("source_lang : " + source_lang)
        // 如果是中文则翻译成英文，否则翻译成中文
        if (source_lang === 'zh') {
            target_lang = 'en'
        } else {
            target_lang = 'zh'
        }

        id = getRandomNumber()
        const url = 'https://interpreter.cyapi.cn/v1/translator';
        const post_data = init_data(source_lang, target_lang)
        post_data.source = translate_text
        post_data.request_id = getRandomNumber()
        try {
            let response = await fetch(
                url,
                {
                    method: "POST",
                    header: {
                        'Content-Type': 'application/json',
                        'x-authorization': 'token ssdj273ksdiwi923bsd9',
                        'user-agent': 'caiyunInterpreter/5 CFNetwork/1404.0.5 Darwin/22.3.0'
                    },
                    body: post_data,
                })

            // 等待延迟一秒
            let data = await response.json()
            console.log("data" + JSON.stringify(data))

            display.streamOutput(data.target || data.message)
            console.log("end")
            display.endOutput()

        } catch (e) {
            console.log("error" + JSON.stringify(e))
            Object.assign(e, {
                _type: 'network',
                _message: '接口请求错误 - ' + JSON.stringify(e),
            });
            throw e;
        }
    }
}

let text = $TEXT || $CONTEXT_TEXT
translate(text).then(r => {
})


