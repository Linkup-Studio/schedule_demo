import type { Team, GameEvent, Attendance, Announcement } from './types';

// ============================================================
// チーム定義（2チーム）
// ============================================================
export const teams: Team[] = [
  {
    id: 'team-issiki-sk',
    name: '一色SKクラブ',
    slug: 'issiki-sk',
    themeColor: '#1a237e',
    themeColorLight: '#3949ab',
    description: '愛知県西尾市一色町の中学野球クラブチーム',
    passphrase: 'sk2026',
    adminPin: '1234',
    playerCounts: { grade1: 8, grade2: 10, grade3: 12 },
  },
  {
    id: 'team-minato-stars',
    name: '港スターズ',
    slug: 'minato-stars',
    themeColor: '#b71c1c',
    themeColorLight: '#e53935',
    description: '名古屋市港区の中学野球クラブチーム',
    passphrase: 'stars2026',
    adminPin: '5678',
    playerCounts: { grade1: 6, grade2: 9, grade3: 11 },
  },
];

// ============================================================
// イベント（試合・練習）
// ============================================================
export const events: GameEvent[] = [
  // --- 一色SK ---
  {
    id: 'ev-sk-1',
    teamId: 'team-issiki-sk',
    title: '西三河リーグ 第3節',
    eventType: 'official',
    opponent: '碧南ファイターズ',
    venueName: '一色球場',
    venueAddress: '愛知県西尾市一色町',
    dateStart: '2026-04-19T09:00:00',
    meetingTime: '07:30',
    meetingPlace: '一色球場 正面入口',
    items: 'ユニフォーム、スパイク、弁当、水筒',
    rsvpDeadline: '2026-04-16',
    targetGrades: [2, 3],
  },
  {
    id: 'ev-sk-2',
    teamId: 'team-issiki-sk',
    title: '練習試合 vs 高浜ブルーウェーブ',
    eventType: 'practice',
    opponent: '高浜ブルーウェーブ',
    venueName: '高浜中央グラウンド',
    dateStart: '2026-04-20T13:00:00',
    dateEnd: '2026-04-20T17:00:00',
    meetingTime: '12:00',
    items: '練習着、スパイク、水筒',
    rsvpDeadline: '2026-04-17',
    targetGrades: [1, 2, 3],
  },
  {
    id: 'ev-sk-3',
    teamId: 'team-issiki-sk',
    title: '春季大会 1回戦',
    eventType: 'official',
    opponent: '岡崎サンダース',
    venueName: '岡崎市民球場',
    venueAddress: '愛知県岡崎市',
    dateStart: '2026-04-26T10:00:00',
    meetingTime: '08:00',
    meetingPlace: '一色球場集合 → バス移動',
    items: 'ユニフォーム、スパイク、弁当、水筒、防寒着',
    rsvpDeadline: '2026-04-23',
    targetGrades: [3],
  },
  {
    id: 'ev-sk-4',
    teamId: 'team-issiki-sk',
    title: 'グラウンド整備・清掃',
    eventType: 'other',
    venueName: '一色球場',
    dateStart: '2026-04-27T08:00:00',
    dateEnd: '2026-04-27T12:00:00',
    items: '軍手、タオル、水筒',
    targetGrades: [1, 2, 3],
  },
  // --- 港スターズ ---
  {
    id: 'ev-ms-1',
    teamId: 'team-minato-stars',
    title: '名古屋市大会 2回戦',
    eventType: 'official',
    opponent: '千種レッドソックス',
    venueName: '港サッカー場（隣接野球場）',
    venueAddress: '名古屋市港区',
    dateStart: '2026-04-19T10:00:00',
    meetingTime: '08:30',
    items: 'ユニフォーム、スパイク、弁当、水筒',
    rsvpDeadline: '2026-04-16',
    targetGrades: [2, 3],
  },
  {
    id: 'ev-ms-2',
    teamId: 'team-minato-stars',
    title: '練習試合 vs 中川ナイン',
    eventType: 'practice',
    opponent: '中川ナイン',
    venueName: '荒子川公園グラウンド',
    dateStart: '2026-04-20T09:00:00',
    dateEnd: '2026-04-20T12:00:00',
    meetingTime: '08:30',
    rsvpDeadline: '2026-04-17',
    targetGrades: [1, 2, 3],
  },
  {
    id: 'ev-ms-3',
    teamId: 'team-minato-stars',
    title: 'GW強化合宿',
    eventType: 'other',
    venueName: '知多スポーツセンター',
    venueAddress: '愛知県知多市',
    dateStart: '2026-05-03T09:00:00',
    dateEnd: '2026-05-05T15:00:00',
    meetingTime: '07:00',
    meetingPlace: '港区役所前 集合',
    items: '着替え3日分、洗面用具、弁当（初日のみ）、寝袋',
    notes: '宿泊費: 8,000円（当日集金）',
    rsvpDeadline: '2026-04-25',
    targetGrades: [1, 2, 3],
  },
];

// ============================================================
// 出欠回答
// ============================================================
export const attendances: Attendance[] = [
  // ev-sk-1 (西三河リーグ)
  { id: 'att-1', eventId: 'ev-sk-1', teamId: 'team-issiki-sk', respondentName: '田中太郎', grade: 3, status: 'attend', answeredAt: '2026-04-14T18:30:00' },
  { id: 'att-2', eventId: 'ev-sk-1', teamId: 'team-issiki-sk', respondentName: '鈴木一郎', grade: 3, status: 'attend', answeredAt: '2026-04-14T19:00:00' },
  { id: 'att-3', eventId: 'ev-sk-1', teamId: 'team-issiki-sk', respondentName: '佐藤花子', grade: 2, status: 'absent', reason: '塾のため', answeredAt: '2026-04-15T08:00:00' },
  { id: 'att-4', eventId: 'ev-sk-1', teamId: 'team-issiki-sk', respondentName: '山田次郎', grade: 3, status: 'attend', answeredAt: '2026-04-15T12:00:00' },
  { id: 'att-5', eventId: 'ev-sk-1', teamId: 'team-issiki-sk', respondentName: '中村健太', grade: 2, status: 'undecided', reason: '体調次第', answeredAt: '2026-04-15T20:00:00' },
  // ev-sk-2 (練習試合)
  { id: 'att-6', eventId: 'ev-sk-2', teamId: 'team-issiki-sk', respondentName: '田中太郎', grade: 3, status: 'attend', answeredAt: '2026-04-14T18:35:00' },
  { id: 'att-7', eventId: 'ev-sk-2', teamId: 'team-issiki-sk', respondentName: '鈴木一郎', grade: 3, status: 'attend', answeredAt: '2026-04-14T19:05:00' },
  // ev-ms-1 (名古屋市大会)
  { id: 'att-8', eventId: 'ev-ms-1', teamId: 'team-minato-stars', respondentName: '伊藤翔太', grade: 3, status: 'attend', answeredAt: '2026-04-14T20:00:00' },
  { id: 'att-9', eventId: 'ev-ms-1', teamId: 'team-minato-stars', respondentName: '渡辺陸', grade: 2, status: 'attend', answeredAt: '2026-04-15T07:00:00' },
  { id: 'att-10', eventId: 'ev-ms-1', teamId: 'team-minato-stars', respondentName: '高橋蓮', grade: 3, status: 'absent', reason: '家族旅行', answeredAt: '2026-04-15T09:00:00' },
];

// ============================================================
// お知らせ
// ============================================================
export const announcements: Announcement[] = [
  // 一色SK
  {
    id: 'ann-sk-1',
    teamId: 'team-issiki-sk',
    title: '4月の月謝について',
    body: '4月分の月謝（5,000円）は4月20日までにお振込みください。\n振込先：三河信用金庫 一色支店 普通 1234567\n名義：イッシキSKクラブ\n\nご不明点は監督までお願いします。',
    isPinned: true,
    targetGrades: [0],
    createdAt: '2026-04-10T10:00:00',
  },
  {
    id: 'ann-sk-2',
    teamId: 'team-issiki-sk',
    title: 'GW期間の練習予定',
    body: '5/3〜5/5はお休みです。5/6から通常練習を再開します。\n各自、自主トレは忘れずに！',
    isPinned: false,
    targetGrades: [0],
    createdAt: '2026-04-12T15:00:00',
  },
  {
    id: 'ann-sk-3',
    teamId: 'team-issiki-sk',
    title: '中3 保護者会のお知らせ',
    body: '4月25日（土）17:00〜 一色公民館にて中3保護者会を開催します。\n進路相談や夏の大会に向けたスケジュールを共有します。\nご出席をお願いします。',
    isPinned: false,
    targetGrades: [3],
    createdAt: '2026-04-14T09:00:00',
  },
  // 港スターズ
  {
    id: 'ann-ms-1',
    teamId: 'team-minato-stars',
    title: 'GW合宿の参加費について',
    body: '5/3〜5/5の強化合宿の参加費は8,000円です。\n当日、封筒に入れてお持ちください。\n\nキャンセルは4/28までにご連絡ください。',
    isPinned: true,
    targetGrades: [0],
    createdAt: '2026-04-11T11:00:00',
  },
  {
    id: 'ann-ms-2',
    teamId: 'team-minato-stars',
    title: '新入部員歓迎会',
    body: '4月29日（火・祝）に新入部員歓迎BBQを開催します！\n場所：荒子川公園BBQ広場\n時間：11:00〜14:00\n参加費：1人500円（食材費）\n\n保護者の方もぜひご参加ください。',
    isPinned: false,
    targetGrades: [0],
    createdAt: '2026-04-13T14:00:00',
  },
];
