var config = require('./config.js');
var utils = require('./utils.js');

function main(text, contextText, completion) {

    (async () => {
        const translate_text = text || contextText.value || await Clipboard.readText();

        console.log("begin")

        if (translate_text !== '') {
            let detected_lang = await $Lang.detect(translate_text)
            console.log("detected_lang: " + detected_lang)
            const targetLanguage = utils.langMap.get(detected_lang);

            console.log("targetLanguage: " + targetLanguage)
            if (!targetLanguage) {
                const err = new Error();
                Object.assign(err, {
                    _type: 'error',
                    _message: '不支持该语种',
                });
                throw err;
            }

            // 如果是中文则翻译成英文，否则翻译成中文

            let target_voice = $option[targetLanguage + '-speaker']
            console.log("target_voice: " + target_voice)

            try {
                try {
                    const resp = await fetch(
                        "https://southeastasia.api.speech.microsoft.com/accfreetrial/texttospeech/acc/v3.0-beta1/vcg/speak",
                        {
                            method: "POST",
                            header: {
                                'authority': 'southeastasia.api.speech.microsoft.com',
                                'accept': '*/*',
                                'accept-language': 'zh-CN,zh;q=0.9',
                                'cache-control': 'no-cache',
                                'content-type': 'application/json',
                                'origin': 'https://azure.microsoft.com',
                                'pragma': 'no-cache',
                                'referer': 'https://azure.microsoft.com/',
                                'sec-ch-ua': '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
                                'sec-ch-ua-mobile': '?0',
                                'sec-ch-ua-platform': '"macOS"',
                                'sec-fetch-dest': 'empty',
                                'sec-fetch-mode': 'cors',
                                'sec-fetch-site': 'same-site',
                                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36'
                            },
                            // body: {"lang": targetLanguage, "speaker": $option[targetLanguage + '-speaker'], "text": query.text},
                            body: {
                                "ttsAudioFormat": "audio-24khz-160kbitrate-mono-mp3",
                                "ssml": `<speak xmlns=\"http://www.w3.org/2001/10/synthesis\" xmlns:mstts=\"http://www.w3.org/2001/mstts\" version=\"1.0\" xml:lang=\"${targetLanguage}\"><voice name=\"${$option[targetLanguage + '-speaker']}\"><mstts:express-as><prosody rate=\"1\" pitch=\"0%\">${translate_text}</prosody></mstts:express-as></voice></speak>`
                            }
                        });

                    let contentType = resp.headers.get('Content-Type')
                    console.log("contentType: " + contentType)

                    if (contentType === "application/json") {
                        let jsonResp = await resp.json();

                        completion({
                            result: {
                                "type": "error",
                                "value": jsonResp.error.message || "未知错误",
                                "contentType": contentType,
                            },
                        });

                    } else {
                        completion({
                            result: {
                                "type": "audio",
                                "format": "base64",
                                "value": resp.rawData.toBase64(),
                                "contentType": contentType,
                                "raw": {}
                            },
                        });
                    }
                } catch (e) {
                    throw e;
                }

            } catch (e) {
                console.log("error" + JSON.stringify(e))
                Object.assign(e, {
                    _type: 'network',
                    _message: '接口请求错误 - ' + JSON.stringify(e),
                });
                throw e;
            }
        }
    })().catch((err) => {
        completion({
            result: {
                type: "error",
                value: err._message || '未知错误',
            },
        });
    });
}


