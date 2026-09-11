import avatar001 from "@/assets/admin-icon/001-monk.svg";
import avatar002 from "@/assets/admin-icon/002-crossbow.svg";
import avatar003 from "@/assets/admin-icon/003-bow.svg";
import avatar004 from "@/assets/admin-icon/004-priest.svg";
import avatar005 from "@/assets/admin-icon/005-martial.svg";
import avatar006 from "@/assets/admin-icon/006-barbarian.svg";
import avatar007 from "@/assets/admin-icon/007-gunnery.svg";
import avatar008 from "@/assets/admin-icon/008-samurai.svg";
import avatar009 from "@/assets/admin-icon/009-alchemy.svg";
import avatar010 from "@/assets/admin-icon/010-druid.svg";
import avatar011 from "@/assets/admin-icon/011-adventurer.svg";
import avatar012 from "@/assets/admin-icon/012-dragon.svg";
import avatar013 from "@/assets/admin-icon/013-adventurer.svg";
import avatar014 from "@/assets/admin-icon/014-swordsman.svg";
import avatar015 from "@/assets/admin-icon/015-knight.svg";
import avatar016 from "@/assets/admin-icon/016-ninja.svg";
import avatar017 from "@/assets/admin-icon/017-wizard.svg";
import avatar018 from "@/assets/admin-icon/018-magician.svg";
import avatar019 from "@/assets/admin-icon/019-assasin.svg";
import avatar020 from "@/assets/admin-icon/020-thief.svg";

export const ADMIN_AVATARS = [
  ["001-monk.svg", avatar001], ["002-crossbow.svg", avatar002], ["003-bow.svg", avatar003],
  ["004-priest.svg", avatar004], ["005-martial.svg", avatar005], ["006-barbarian.svg", avatar006],
  ["007-gunnery.svg", avatar007], ["008-samurai.svg", avatar008], ["009-alchemy.svg", avatar009],
  ["010-druid.svg", avatar010], ["011-adventurer.svg", avatar011], ["012-dragon.svg", avatar012],
  ["013-adventurer.svg", avatar013], ["014-swordsman.svg", avatar014], ["015-knight.svg", avatar015],
  ["016-ninja.svg", avatar016], ["017-wizard.svg", avatar017], ["018-magician.svg", avatar018],
  ["019-assasin.svg", avatar019], ["020-thief.svg", avatar020],
];

export function getAdminAvatarSource(name) {
  return ADMIN_AVATARS.find(([fileName]) => fileName === name)?.[1] || ADMIN_AVATARS[0][1];
}
