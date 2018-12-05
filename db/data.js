// seed data for multiple users
// User #1 = "Ms Green" is related to odd number _id
// User #2 = "Mr Yellow" is related to odd number _id

const notes = [
  {
    _id: '111111111111111111111101',
    title: '5 life lessons learned from cats',
    content: 'Lorem ipsum dolor amet wayfarers lumbersexual four dollar toast, literally vegan readymade af tofu intelligentsia hella kombucha salvia photo booth post-ironic succulents.',
    userId: '000000000000000000000001'
  },
  {
    _id: '111111111111111111111103',
    title: "What the government doesn't want you to know about cats",
    content: ' Banh mi snackwave williamsburg chicharrones tumblr. Tilde forage 3 wolf moon blog green juice, copper mug photo booth.',
    folderId: '222222222222222222222201',
    userId: '000000000000000000000001'
  },
  {
    _id: '111111111111111111111105',
    title: "The most boring article about cats you'll ever read",
    content: 'Everyday carry vape locavore, microdosing occupy man bun hashtag. Palo santo chartreuse helvetica stumptown cred edison bulb hella mixtape taiyaki 3 wolf moon distillery la croix',
    tags: ['333333333333333333333305', '333333333333333333333307'],
    userId: '000000000000000000000001'
  },
  {
    _id: '111111111111111111111107',
    title: '7 things lady gaga has in common with cats',
    content: 'Fanny pack hot chicken lyft tumblr fingerstache yr iPhone knausgaard VHS selvage cardigan artisan fam literally.',
    folderId: '222222222222222222222203',
    tags: ['333333333333333333333301', '333333333333333333333303', '333333333333333333333305'],
    userId: '000000000000000000000001'
  },
  {
    _id: '111111111111111111111109',
    title: "The most incredible article about cats you'll ever read",
    content: 'Pok pok truffaut bushwick hella la croix butcher skateboard freegan enamel pin gluten-free viral palo santo. Farm-to-table art party bespoke, flannel health goth PBR&B lyft.',
    userId: '000000000000000000000001'
  },
  {
    _id: '111111111111111111111102',
    title: 'One weird trick to train your dog',
    content: 'You probably haven\'t heard of them hashtag banjo, small batch viral hella flannel lomo tilde meh. Vaporware cray brunch, photo booth echo park bicycle rights lomo fingerstache pickled cloud bread activated charcoal hashtag knausgaard biodiesel.',
    folderId: '222222222222222222222204',
    userId: '000000000000000000000002'
  },
  {
    _id: '111111111111111111111104',
    title: '10 ways dogs can help you live to 100',
    content: 'Ramps XOXO affogato truffaut. Shaman drinking vinegar pork belly occupy umami gluten-free, copper mug portland marfa tacos chillwave. Jianbing fingerstache keytar tattooed craft beer kombucha shaman narwhal.',
    folderId: '222222222222222222222206',
    userId: '000000000000000000000002'
  },
  {
    _id: '111111111111111111111106',
    title: '9 reasons you can blame the recession on dogs',
    content: 'Whatever drinking vinegar readymade beard. Taiyaki butcher mustache, tumblr swag enamel pin chia biodiesel PBR&B shabby chic.',
    tags: ['333333333333333333333302'],
    userId: '000000000000000000000002'
  },
  {
    _id: '111111111111111111111108',
    title: '10 ways marketers are making you addicted to dogs',
    content: 'Aesthetic hell of wayfarers, readymade jianbing pug unicorn brunch narwhal tumeric. Direct trade lomo mixtape pop-up schlitz hoodie 90\'s sustainable hexagon pitchfork venmo polaroid.',
    folderId: '222222222222222222222202',
    tags: ['333333333333333333333302', '333333333333333333333306', '333333333333333333333308'],
    userId: '000000000000000000000002'
  }
];

const folders = [
  {
    _id: '222222222222222222222201',
    name: 'Archive',
    userId: '000000000000000000000001'
  },
  {
    _id: '222222222222222222222203',
    name: 'Drafts',
    userId: '000000000000000000000001'
  },
  {
    _id: '222222222222222222222205',
    name: 'Personal',
    userId: '000000000000000000000001'
  },
  {
    _id: '111111111111111111111107',
    name: 'Work',
    userId: '000000000000000000000001'
  },

  {
    _id: '222222222222222222222202',
    name: 'Archive',
    userId: '000000000000000000000002'
  },
  {
    _id: '222222222222222222222204',
    name: 'Important',
    userId: '000000000000000000000002'
  },
  {
    _id: '222222222222222222222206',
    name: 'Personal',
    userId: '000000000000000000000002'
  },
  {
    _id: '222222222222222222222208',
    name: 'Work-In-Progress',
    userId: '000000000000000000000002'
  }
];

const tags = [
  {
    _id: '333333333333333333333301',
    name: 'Foo',
    userId: '000000000000000000000001'
  },
  {
    _id: '333333333333333333333303',
    name: 'Bar',
    userId: '000000000000000000000001'
  },
  {
    _id: '333333333333333333333305',
    name: 'Baz',
    userId: '000000000000000000000001'
  },
  {
    _id: '333333333333333333333307',
    name: 'Qux',
    userId: '000000000000000000000001'
  },

  {
    _id: '333333333333333333333302',
    name: 'Waldo',
    userId: '000000000000000000000002'
  },
  {
    _id: '333333333333333333333304',
    name: 'Thud',
    userId: '000000000000000000000002'
  },
  {
    _id: '333333333333333333333306',
    name: 'Wobble',
    userId: '000000000000000000000002'
  },
  {
    _id: '333333333333333333333308',
    name: 'Boop',
    userId: '000000000000000000000002'
  }
];

const users = [
  {
    _id: '000000000000000000000001',
    fullname: 'Joe Dirt',
    username: 'MulletMan',
    password: '$2a$12$nuITTPvs3zUUdqZwKv6eieyz9sYtyO3pd3oUWgyzZR/QE7Dfm44pu'
  },
  {
    _id: '000000000000000000000002',
    fullname: 'Rob Schneider',
    username: 'DeuceBigalo',
    password: '$2a$12$nuITTPvs3zUUdqZwKv6eieyz9sYtyO3pd3oUWgyzZR/QE7Dfm44pu'
  }
];

module.exports = { folders, notes, tags, users };