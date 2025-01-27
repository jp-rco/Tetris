const d = document,
    n = navigator, 
    ua = n.userAgent
;

export default 
function userDeviceInfo(id) {
    const $id = d.getElementById(id),
    isMobile = {
        android: () => ua.match(/android/i),
        ios: () => ua.match(/iphone|ipad|ipod/i),
        windows: () => ua.match(/windows phone/i),
        any: function () {
            return this.android() || this.ios();
        }
    },
    isDesktop = {
        linux: () => ua.match(/linux/i),
        mac: () => ua.match(/mac os/i),
        windows: () => ua.match(/windows nt/i),
        any: function () {
            return this.linux() || this.mac() || this.windows();
        }
    }
    ;
    if(isMobile.any()){
        $id.innerHTML = `
        <div class="button up">
            <img class="up" src="./assets/up-arrow.png">
        </div>
        <article class="buttons">
            <div class="button left">
                <img class="left" src="./assets/left-arrow.png">
            </div>
            <div class="button down">
                <img class="down" src="./assets/down-arrow.png">
            </div>
            <div class="button right">
                <img class="right" src="./assets/right-arrow.png">
            </div>
        </article>
        `;
    }
    else if(isDesktop.any()){
        $id.innerHTML = `
        <div class="buttons">
            <div>↑ Rotate</div>
            <div>↓ Down</div>
            <div>→ Right</div>
            <div>← Left</div>
        </div>
        `;
    }
}