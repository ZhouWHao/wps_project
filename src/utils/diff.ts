export interface IUserRecord {
  id: number;
  account: string; // 唯一
  name: string;
  phone?: string;
  email?: string;
  password?: string;
  departments: string[][]; //部门(每个人可能多个部门，并且存在子部门。例如: 这个人同时在A部门的b子部门和B部门的c子部门，则departments为[[A,b],[B,c]])
}

export type departmentsDiffInfo = Pick<
  IUserRecord,
  'account' | 'departments' | 'id'
>[];

export interface departmentsDiffObj {
  added: departmentsDiffInfo; // 新增的部门与部门成员
  updated: {
    // 修改的部门
    original: departmentsDiffInfo[number]; // 原部门信息
    updated: departmentsDiffInfo[number]; // 修改后的部门信息
  }[];
  deleted: departmentsDiffInfo; // 被删除的成员与部门
}

export function getDepartmentsDiff(
  listA: IUserRecord[],
  listB: IUserRecord[]
): departmentsDiffObj {
  listA = listA.filter((it) => it.departments.length !== 0);
  listB = listB.filter((it) => it.departments.length !== 0);
  const mapA: { [account: string]: IUserRecord } = {};
  const mapB: { [account: string]: IUserRecord } = {};
  const added: departmentsDiffInfo = [];
  const updated: {
    original: departmentsDiffInfo[number];
    updated: departmentsDiffInfo[number];
  }[] = [];
  const deleted: departmentsDiffInfo = [];

  for (const item of listA) {
    mapA[item.account] = item;
  }

  for (const item of listB) {
    mapB[item.account] = item;
  }

  for (const account in mapB) {
    const itemA = mapA[account];
    const itemB = mapB[account];

    if (!itemA) {
      added.push({
        id:itemB.id,
        account: itemB.account,
        departments: itemB.departments,
      });
    } else if (
      JSON.stringify(itemA.departments) !== JSON.stringify(itemB.departments)
    ) {
      updated.push({
        original: {
          id:itemA.id,
          account: itemA.account,
          departments: itemA.departments,
        },
        updated: {
          id:itemB.id,
          account: itemB.account,
          departments: itemB.departments,
        },
      });
    }
  }

  for (const account in mapA) {
    const itemA = mapA[account];
    const itemB = mapB[account];

    if (!itemB) {
      deleted.push({
        id:itemA.id,
        account: itemA.account,
        departments: itemA.departments,
      });
    }
  }

  return { added, updated, deleted };
}

export type UserRecord = IUserRecord;

export interface accountsDiffInfo {
  added: UserRecord[]; // 新增的用户
  updated: {
    // 修改的用户
    original: UserRecord; // 原用户信息
    updated: UserRecord; // 修改后的用户信息
  }[];
  deleted: UserRecord[]; // 删除的用户
}

export function getAccountsDiff(
  listA: UserRecord[],
  listB: UserRecord[]
): accountsDiffInfo {
  const added: UserRecord[] = [];
  const updated: {
    original: UserRecord;
    updated: UserRecord;
  }[] = [];
  const deleted: UserRecord[] = [];

  // 找到新增的用户
  added.push(
    ...listB.filter(
      (userB) => !listA.find((userA) => userA.account === userB.account)
    )
  );

  // 找到修改的用户
  for (const userB of listB) {
    const userA = listA.find((user) => user.account === userB.account);
    if (
      userA &&
      (userA.name !== userB.name ||
        userA.phone !== userB.phone ||
        userA.email !== userB.email)
    ) {
      updated.push({ original: userA, updated: userB });
    }
  }

  // 找到删除的用户
  deleted.push(
    ...listA.filter(
      (userA) => !listB.find((userB) => userB.account === userA.account)
    )
  );

  return { added, updated, deleted };
}
