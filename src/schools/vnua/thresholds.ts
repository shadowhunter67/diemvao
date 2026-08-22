export type VnuaProgramGroupId =
  | 'HVN01'
  | 'HVN02'
  | 'HVN03'
  | 'HVN04'
  | 'HVN05'
  | 'HVN06'
  | 'HVN07'
  | 'HVN08'
  | 'HVN09'
  | 'HVN10'
  | 'HVN11'
  | 'HVN12'
  | 'HVN13'
  | 'HVN14'
  | 'HVN15'
  | 'HVN16'
  | 'HVN17'
  | 'HVN18'
  | 'HVN19'
  | 'HVN20'
  | 'HVN21'
  | 'HVN22'
  | 'HVN23';

export interface VnuaProgramGroupThreshold {
  groupId: VnuaProgramGroupId;
  groupName: string;
  thptMin30?: number;
  transcriptMin30?: number;
  governedByMinistry?: true;
  sourceId: 'vnua-threshold-notice-2026';
  imageUrl: string;
}

const thresholdImageUrl = 'https://file.vnua.edu.vn/data/0/images/2026/07/08/host/tb1.jpg?w=680';

export const VNUA_PROGRAM_GROUP_THRESHOLDS_2026: readonly VnuaProgramGroupThreshold[] = [
  { groupId: 'HVN01', groupName: 'Thu y', thptMin30: 16, transcriptMin30: 19, sourceId: 'vnua-threshold-notice-2026', imageUrl: thresholdImageUrl },
  { groupId: 'HVN02', groupName: 'Chan nuoi thu y - Thuy san', thptMin30: 16, transcriptMin30: 19, sourceId: 'vnua-threshold-notice-2026', imageUrl: thresholdImageUrl },
  { groupId: 'HVN03', groupName: 'Nong nghiep va canh quan', thptMin30: 16, transcriptMin30: 19, sourceId: 'vnua-threshold-notice-2026', imageUrl: thresholdImageUrl },
  { groupId: 'HVN04', groupName: 'Cong nghe ky thuat o to va Co dien tu', thptMin30: 16, transcriptMin30: 19, sourceId: 'vnua-threshold-notice-2026', imageUrl: thresholdImageUrl },
  { groupId: 'HVN05', groupName: 'Ky thuat co khi', thptMin30: 16, transcriptMin30: 19, sourceId: 'vnua-threshold-notice-2026', imageUrl: thresholdImageUrl },
  { groupId: 'HVN06', groupName: 'Ky thuat dien, Dien tu va Tu dong hoa', thptMin30: 16, transcriptMin30: 19, sourceId: 'vnua-threshold-notice-2026', imageUrl: thresholdImageUrl },
  { groupId: 'HVN07', groupName: 'Logistics va Quan ly chuoi cung ung', thptMin30: 16, transcriptMin30: 19, sourceId: 'vnua-threshold-notice-2026', imageUrl: thresholdImageUrl },
  { groupId: 'HVN08', groupName: 'Ke toan, Quan tri kinh doanh va Thuong mai', thptMin30: 16, transcriptMin30: 19, sourceId: 'vnua-threshold-notice-2026', imageUrl: thresholdImageUrl },
  { groupId: 'HVN09', groupName: 'Cong nghe sinh hoc va Cong nghe duoc lieu', thptMin30: 17, transcriptMin30: 20, sourceId: 'vnua-threshold-notice-2026', imageUrl: thresholdImageUrl },
  { groupId: 'HVN10', groupName: 'Cong nghe thuc pham va Che bien', thptMin30: 16, transcriptMin30: 19, sourceId: 'vnua-threshold-notice-2026', imageUrl: thresholdImageUrl },
  { groupId: 'HVN11', groupName: 'Kinh te va Quan ly', thptMin30: 16, transcriptMin30: 19, sourceId: 'vnua-threshold-notice-2026', imageUrl: thresholdImageUrl },
  { groupId: 'HVN12', groupName: 'Xa hoi hoc', thptMin30: 16, transcriptMin30: 19, sourceId: 'vnua-threshold-notice-2026', imageUrl: thresholdImageUrl },
  { groupId: 'HVN13', groupName: 'Luat', governedByMinistry: true, sourceId: 'vnua-threshold-notice-2026', imageUrl: thresholdImageUrl },
  { groupId: 'HVN14', groupName: 'Cong nghe thong tin va Ky thuat so', thptMin30: 17, transcriptMin30: 20, sourceId: 'vnua-threshold-notice-2026', imageUrl: thresholdImageUrl },
  { groupId: 'HVN15', groupName: 'Quan ly dat dai, Bat dong san va Moi truong', thptMin30: 16, transcriptMin30: 19, sourceId: 'vnua-threshold-notice-2026', imageUrl: thresholdImageUrl },
  { groupId: 'HVN16', groupName: 'Khoa hoc moi truong', thptMin30: 16, transcriptMin30: 19, sourceId: 'vnua-threshold-notice-2026', imageUrl: thresholdImageUrl },
  { groupId: 'HVN17', groupName: 'Ngon ngu Anh', thptMin30: 16, transcriptMin30: 19, sourceId: 'vnua-threshold-notice-2026', imageUrl: thresholdImageUrl },
  { groupId: 'HVN18', groupName: 'Ngon ngu Trung Quoc', thptMin30: 20, transcriptMin30: 23, sourceId: 'vnua-threshold-notice-2026', imageUrl: thresholdImageUrl },
  { groupId: 'HVN19', groupName: 'Su pham cong nghe', governedByMinistry: true, sourceId: 'vnua-threshold-notice-2026', imageUrl: thresholdImageUrl },
  { groupId: 'HVN20', groupName: 'Du lich', thptMin30: 16, transcriptMin30: 19, sourceId: 'vnua-threshold-notice-2026', imageUrl: thresholdImageUrl },
  { groupId: 'HVN21', groupName: 'Quan ly va phat trien du lich', thptMin30: 16, transcriptMin30: 19, sourceId: 'vnua-threshold-notice-2026', imageUrl: thresholdImageUrl },
  { groupId: 'HVN22', groupName: 'Quy hoach vung va Do thi', thptMin30: 16, transcriptMin30: 19, sourceId: 'vnua-threshold-notice-2026', imageUrl: thresholdImageUrl },
  { groupId: 'HVN23', groupName: 'Di san hoc', thptMin30: 16, transcriptMin30: 19, sourceId: 'vnua-threshold-notice-2026', imageUrl: thresholdImageUrl },
];

export function getVnuaProgramGroupThreshold(groupId?: string): VnuaProgramGroupThreshold | undefined {
  return VNUA_PROGRAM_GROUP_THRESHOLDS_2026.find((threshold) => threshold.groupId === groupId);
}
