import {
  getDepartmentsDiff,
  IUserRecord,
  getAccountsDiff,
  UserRecord,
  accountsDiffInfo,
} from '../diff';

describe('getDepartmentsDiff', () => {
  const userA: IUserRecord[] = [
    {
      id:1,
      account: 'user1',
      name: '张三',
      phone: '1234567890',
      email: 'user1@example.com',
      departments: [['部门A', '子部门B'], ['部门C']],
    },
    {
      id:2,
      account: 'user2',
      name: '李四',
      phone: '0987654321',
      email: 'user2@example.com',
      departments: [
        ['部门A', '子部门C'],
        ['部门D', '子部门E'],
      ],
    },
    {
      id:3,
      account: 'user3',
      name: '王五',
      departments: [['部门B', '子部门D'], ['部门E']],
    },
    {
      id:4,
      account: 'user4',
      name: '赵六',
      departments: [['部门C', '子部门F'], ['部门G']],
    },
  ];

  const userB: IUserRecord[] = [
    {
      id:1,
      account: 'user1',
      name: '张三',
      phone: '1234567890',
      email: 'user1@example.com',
      departments: [['部门A', '子部门B'], ['部门C']],
    },
    {
      id:2,
      account: 'user2',
      name: '李四',
      phone: '0987654321',
      email: 'user2@example.com',
      departments: [
        ['部门A', '子部门C'],
        ['部门D', '子部门E'],
      ],
    },
    {
      id:3,
      account: 'user3',
      name: '王五',
      departments: [
        ['部门B', '子部门D'],
        ['部门E', '子部门F'],
      ],
    },
    {
      id:4,
      account: 'user5',
      name: '钱七',
      departments: [['部门H', '子部门I'], ['部门J']],
    },
  ];

  it('should return the expected result', () => {
    const result = getDepartmentsDiff(userA, userB);

    expect(result.added).toEqual([
      {
        account: 'user5',
        departments: [['部门H', '子部门I'], ['部门J']],
      },
    ]);

    expect(result.updated).toEqual([
      {
        original: {
          account: 'user3',
          departments: [['部门B', '子部门D'], ['部门E']],
        },
        updated: {
          account: 'user3',
          departments: [
            ['部门B', '子部门D'],
            ['部门E', '子部门F'],
          ],
        },
      },
    ]);

    expect(result.deleted).toEqual([
      {
        account: 'user4',
        departments: [['部门C', '子部门F'], ['部门G']],
      },
    ]);
  });
});

describe('getAccountsDiff', () => {
  const userA1: UserRecord = {
    id:1,
    account: 'userA1',
    name: 'User A1',
    phone: '111-111-1111',
    email: 'userA1@example.com',
    departments: [
      ['部门B', '子部门D'],
      ['部门E', '子部门F'],
    ],
  };
  const userA2: UserRecord = {
    id:1,
    account: 'userA2',
    name: 'User A2',
    phone: '222-222-2222',
    email: 'userA2@example.com',
    departments: [
      ['部门B', '子部门D'],
      ['部门E', '子部门F'],
    ],
  };
  const userB1: UserRecord = {
    id:1,
    account: 'userB1',
    name: 'User B1',
    phone: '333-333-3333',
    email: 'userB1@example.com',
    departments: [
      ['部门B', '子部门D'],
      ['部门E', '子部门F'],
    ],
  };
  const userB2: UserRecord = {
    id:1,
    account: 'userB2',
    name: 'User B2',
    phone: '444-444-4444',
    email: 'userB2@example.com',
    departments: [
      ['部门B', '子部门D'],
      ['部门E', '子部门F'],
    ],
  };

  it('should return correct diff when listA is empty', () => {
    const listA: UserRecord[] = [];
    const listB: UserRecord[] = [userA1, userA2, userB1, userB2];
    const expected: accountsDiffInfo = {
      added: [userA1, userA2, userB1, userB2],
      updated: [],
      deleted: [],
    };
    expect(getAccountsDiff(listA, listB)).toEqual(expected);
  });

  it('should return correct diff when listB is empty', () => {
    const listA: UserRecord[] = [userA1, userA2, userB1, userB2];
    const listB: UserRecord[] = [];
    const expected: accountsDiffInfo = {
      added: [],
      updated: [],
      deleted: [userA1, userA2, userB1, userB2],
    };
    expect(getAccountsDiff(listA, listB)).toEqual(expected);
  });

  it('should return correct diff when listA and listB have no differences', () => {
    const listA: UserRecord[] = [userA1, userA2, userB1, userB2];
    const listB: UserRecord[] = [userA1, userA2, userB1, userB2];
    const expected: accountsDiffInfo = { added: [], updated: [], deleted: [] };
    expect(getAccountsDiff(listA, listB)).toEqual(expected);
  });

  it('should return correct diff when there are added users', () => {
    const listA: UserRecord[] = [userA1, userA2];
    const listB: UserRecord[] = [userA1, userA2, userB1, userB2];
    const expected: accountsDiffInfo = {
      added: [userB1, userB2],
      updated: [],
      deleted: [],
    };
    expect(getAccountsDiff(listA, listB)).toEqual(expected);
  });

  it('should return correct diff when there are updated users', () => {
    const listA: UserRecord[] = [userA1, userA2, userB1, userB2];
    const listB: UserRecord[] = [
      { ...userA1, name: 'Updated User A1' },
      userA2,
      { ...userB1, email: 'updatedB1@example.com' },
      userB2,
    ];
    const expected: accountsDiffInfo = {
      added: [],
      updated: [
        { original: userA1, updated: { ...userA1, name: 'Updated User A1' } },
        {
          original: userB1,
          updated: { ...userB1, email: 'updatedB1@example.com' },
        },
      ],
      deleted: [],
    };
    expect(getAccountsDiff(listA, listB)).toEqual(expected);
  });

  it('should return correct diff when there are deleted users', () => {
    const listA: UserRecord[] = [userA1, userA2, userB1, userB2];
    const listB: UserRecord[] = [userA1, userB1];
    const expected: accountsDiffInfo = {
      added: [],
      updated: [],
      deleted: [userA2, userB2],
    };
    expect(getAccountsDiff(listA, listB)).toEqual(expected);
  });
});
