const madaRanges: string[] = [
  '22337902',
  '22337986',
  '22402030',
  '242030',
  '403024',
  '406136',
  '406996',
  '40719700',
  '40739500',
  '407520',
  '409201',
  '410621',
  '410685',
  '410834',
  '412565',
  '417633',
  '419593',
  '420132',
  '421141',
  '422817',
  '422818',
  '422819',
  '428331',
  '428671',
  '428672',
  '428673',
  '431361',
  '432328',
  '434107',
  '439954',
  '440533',
  '440647',
  '440795',
  '442463',
  '445564',
  '446393',
  '446404',
  '446672',
  '45488707',
  '455036',
  '455708',
  '457865',
  '457997',
  '458456',
  '462220',
  '468540',
  '468541',
  '468542',
  '468543',
  '474491',
  '483010',
  '483011',
  '483012',
  '484783',
  '486094',
  '486095',
  '486096',
  '489318',
  '489319',
  '504300',
  '513213',
  '515079',
  '516138',
  '520058',
  '521076',
  '52166100',
  '524130',
  '524514',
  '529415',
  '529741',
  '530060',
  '531196',
  '535825',
  '535989',
  '536023',
  '537767',
  '543085',
  '543357',
  '549760',
  '554180',
  '555610',
  '558563',
  '588845',
  '588848',
  '588850',
  '589206',
  '604906',
  '605141',
  '636120',
  '968201',
  '968202',
  '968203',
  '968204',
  '968205',
  '968206',
  '968207',
  '968208',
  '968209',
  '968211',
];

export const inMadaRange = (number: string): boolean => {
  // TODO: Optimize to a map
  for (const range of madaRanges) {
    if (number.startsWith(range)) {
      return true;
    }
  }

  return false;
};
