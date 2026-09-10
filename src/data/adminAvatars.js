import avatar001 from "@/assets/admin-icon/001-graphic designer.svg";
import avatar002 from "@/assets/admin-icon/002-chef.svg";
import avatar003 from "@/assets/admin-icon/003-farmer.svg";
import avatar004 from "@/assets/admin-icon/004-chemist.svg";
import avatar005 from "@/assets/admin-icon/005-artist.svg";
import avatar006 from "@/assets/admin-icon/006-doctor.svg";
import avatar007 from "@/assets/admin-icon/007-mechanic.svg";
import avatar008 from "@/assets/admin-icon/008-firefighter.svg";
import avatar009 from "@/assets/admin-icon/009-astronaut.svg";
import avatar010 from "@/assets/admin-icon/010-businessman.svg";
import avatar011 from "@/assets/admin-icon/011-news anchor.svg";
import avatar012 from "@/assets/admin-icon/012-policeman.svg";
import avatar013 from "@/assets/admin-icon/013-speaker.svg";
import avatar014 from "@/assets/admin-icon/014-engineer.svg";
import avatar015 from "@/assets/admin-icon/015-pilot.svg";
import avatar016 from "@/assets/admin-icon/016-traveller.svg";
import avatar017 from "@/assets/admin-icon/017-courier.svg";
import avatar018 from "@/assets/admin-icon/018-lawyer.svg";
import avatar019 from "@/assets/admin-icon/019-photographer.svg";
import avatar020 from "@/assets/admin-icon/020-judge.svg";
import avatar021 from "@/assets/admin-icon/021-painter.svg";
import avatar022 from "@/assets/admin-icon/022-diver.svg";
import avatar023 from "@/assets/admin-icon/023-postman.svg";
import avatar024 from "@/assets/admin-icon/024-detective.svg";
import avatar025 from "@/assets/admin-icon/025-american football player.svg";
import avatar026 from "@/assets/admin-icon/026-soldier.svg";
import avatar027 from "@/assets/admin-icon/027-film director.svg";
import avatar028 from "@/assets/admin-icon/028-lifeguard.svg";
import avatar029 from "@/assets/admin-icon/029-tailor.svg";
import avatar030 from "@/assets/admin-icon/030-writer.svg";

export const ADMIN_AVATARS = [
  ["001-graphic designer.svg", avatar001], ["002-chef.svg", avatar002], ["003-farmer.svg", avatar003],
  ["004-chemist.svg", avatar004], ["005-artist.svg", avatar005], ["006-doctor.svg", avatar006],
  ["007-mechanic.svg", avatar007], ["008-firefighter.svg", avatar008], ["009-astronaut.svg", avatar009],
  ["010-businessman.svg", avatar010], ["011-news anchor.svg", avatar011], ["012-policeman.svg", avatar012],
  ["013-speaker.svg", avatar013], ["014-engineer.svg", avatar014], ["015-pilot.svg", avatar015],
  ["016-traveller.svg", avatar016], ["017-courier.svg", avatar017], ["018-lawyer.svg", avatar018],
  ["019-photographer.svg", avatar019], ["020-judge.svg", avatar020], ["021-painter.svg", avatar021],
  ["022-diver.svg", avatar022], ["023-postman.svg", avatar023], ["024-detective.svg", avatar024],
  ["025-american football player.svg", avatar025], ["026-soldier.svg", avatar026], ["027-film director.svg", avatar027],
  ["028-lifeguard.svg", avatar028], ["029-tailor.svg", avatar029], ["030-writer.svg", avatar030],
];

export function getAdminAvatarSource(name) {
  return ADMIN_AVATARS.find(([fileName]) => fileName === name)?.[1] || ADMIN_AVATARS[0][1];
}
