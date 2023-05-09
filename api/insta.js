import instagramGetUrl from "instagram-url-direct";
async function insta(vid_url) {
    try {
        let out = await instagramGetUrl(vid_url)
        return out
    } catch (err) {
        return err
    }
}
export default insta