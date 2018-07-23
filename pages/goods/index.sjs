const basePath = 'https://www.tianrenyun.com/qsqFile/filelib/imagelib/dealerlib/'
export default {
    convertImagePath(id, suffix = '.jpg') {
        return basePath + id + suffix
    }
}