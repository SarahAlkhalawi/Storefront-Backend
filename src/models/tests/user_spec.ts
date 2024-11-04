import { User, UserStore } from "../user";

const store = new UserStore()

describe("User Model", () => {
    let createdUserId: number;
    it('should have an index method', () => {
        expect(store.index).toBeDefined();
    });
  
    it('should have a create method', () => {
        expect(store.create).toBeDefined();
    })
	it('should have a authenticate method', () => {
		expect(store.authenticate).toBeDefined();
	});

    it('create method should add a user', async () => {
        const result = await store.create({
          firstName: 'Sarah',
          lastName: 'Saleh',
            password: 'sar12'
        });
        createdUserId = result.id as number;
        expect(result).not.toBeNull();
    });
    it("authenticate user with password", async () => {
      const output = await store.authenticate("Sarah", "sar12");
      expect(output).not.toBeNull();
  });
  
    it('index method should return a list of users', async () => {
        const result = await store.index();
        expect(result).not.toBeNull();
    });

 
});