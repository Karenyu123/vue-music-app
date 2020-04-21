import jsonp from '../common/js/jsonp'
import { options } from './config'

export function getMusicList(params) {
  let url = 'https: //u.y.qq.com/cgi-bin/musicu.fcg?cgiKey=GetHomePage&_=1584677024489&data={%22comm%22:{%22g_tk%22:5381,%22uin%22:%22%22,%22format%22:%22json%22,%22inCharset%22:%22utf-8%22,%22outCharset%22:%22utf-8%22,%22notice%22:0,%22platform%22:%22h5%22,%22needNewCode%22:1},%22MusicHallHomePage%22:{%22module%22:%22music.musicHall.MusicHallPlatform%22,%22method%22:%22MobileWebHome%22,%22param%22:{%22ShelfId%22:[101,102,161]}},%22hotkey%22:{%22module%22:%22tencent_musicsoso_hotkey.HotkeyService%22,%22method%22:%22GetHotkeyForQQMusicMobile%22,%22param%22:{%22remoteplace%22:%22txt.miniapp.wxada7aab80ba27074%22,%22searchid%22:%221559616839293%22}}}'
  // const data = {
  //   cgiKey: 'GetHomePage',
  //   _: 1584677024489,
  //   data: {
  //     "comm": {
  //       "g_tk": 5381,
  //       "uin": "",
  //       "format": "json",
  //       "inCharset": "utf-8",
  //       "outCharset": "utf-8",
  //       "notice": 0,
  //       "platform": "h5",
  //       "needNewCode": 1
  //     },
  //     "MusicHallHomePage": {
  //       "module": "music.musicHall.MusicHallPlatform",
  //       "method": "MobileWebHome",
  //       "param": {
  //         "ShelfId": [101, 102, 161]
  //       }
  //     },
  //     "hotkey": {
  //       "module": "tencent_musicsoso_hotkey.HotkeyService",
  //       "method": "GetHotkeyForQQMusicMobile",
  //       "param": {
  //         "remoteplace": "txt.miniapp.wxada7aab80ba27074",
  //         "searchid": "1559616839293"
  //       }
  //     }
  //   }
  // }
  return jsonp(url)
}

