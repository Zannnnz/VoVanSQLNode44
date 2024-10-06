import {expect} from "chai"
describe("Math oprations",()=>{
    // Trong day se chua tat ca test case cua bo test nay
    it('should add two integer',()=>{
        const result = 10 + 10;
        //su dung lib chai de mock ket qua tra ve tu fuction hoac bien gi do
        expect(result).to.equal(20);
    });

    it("Testing with array",()=>{
        const arr=[1,2,3];
        // kiem tra xem phan tu co trong mang hay khong
        expect(arr).to.include(3);
    })
})