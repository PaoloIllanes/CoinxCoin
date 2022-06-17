const TestBank = artifacts.require('TestBank');

contract("Lottery",accounts=>{
    let instance;

    beforeEach("Deploy test bank from 0",async ()=>{
        instance = await TestBank.new();
    });
    /*1) Realizar el testing solo el dueño del banco puede crear una cuenta con un balance inicial de cero y cuenta
           desbloqueada controlar internamente*/
    it('Solo el dueño del banco puede crear una cuenta con un balance inicial de cero y cuenta\n' +
        '           desbloqueada controlar internamente', async () => {
        try {
            await instance.createAccount([0, "Propietario", 400, true], {from: accounts[0]});
            const account = await instance.listAccounts.call(0);
            assert.equal(
                account.id, 0 === 0 &&
                account.name ==="Propietario" &&
                account.balance === 0 &&
                account.enable === true,
                true
            );
        } catch (e) {
            assert.equal(e.reason, "You are not the owner.");


        }
    })

        /*2) Realizar el testing si el cliente hace un deposito mayor a 10 ETH se le retorna un bono de 1 ETH*/
        /*3) Realizar el testing solo el dueño puedo cerrar el banco*/
    it("Solo el dueño puedo cerrar el banco", async()=>{
        try {
            await instance.closeOrOpenBank(true,{from:accounts[5]})
            assert(false);
        }catch (e) {
            assert.equal("You are not the owner.",e.reason)
        }

    });
        //4) Realizar el testing el deposito minimo para una cuenta bancaria debe ser mayor a 2 ETH
    it("El deposito minimo para una cuenta bancaria debe ser mayor a 2 ETH", async()=>{
        try {
            await instance.createAccount([1,"543543",0,false],{from: accounts[0]});
            await instance.depositMoney(1,{
                from: accounts[4],
                value: web3.utils.toWei("1", "ether"),
                //Test should fail value: web3.utils.toWei("5", "ether"),
            })
            assert(false);
        }catch (e) {
            assert.equal("The minimun deposit should be more than 2 ETH.",e.reason)
        }

    });
    //5) Realizar el testing el nombre de la cuenta debe tener una longitud mayor a 5 de forma obligatoria
    it("El nombre de la cuenta debe tener una longitud mayor a 5 de forma obligatoria", async()=>{
        try {
            await instance.createAccount([1,"abcd",20,true],{from: accounts[0]})
            assert(false);
        }catch (e) {
            assert.equal("The name of product should be more than 5.",e.reason)
        }

    });
      /*6) Realizar el testing solo el dueño del banco puede bloquear una cuenta bancaria para que esta no pueda
           realizar ningun tipo de transaccion de retiro ni deposito*/
    it("Solo el dueño del banco puede bloquear una cuenta bancaria", async()=>{
        try {
            await instance.blockAccount(2,{from: accounts[5]})
            assert(false);
        }catch (e) {
            assert.equal("You are not the owner.",e.reason)
        }

    });


        /*7) Realizar el testing los clientes pueden hacer el retiro de su dinero controlar si cuenta con el dinero que desea
           retirar en su cuenta bancaria*/
    it("Los clientes pueden hacer el retiro de su dinero controlar si cuenta con el dinero que desea\n" +
        "           retirar en su cuenta bancaria", async()=>{
        try {
            await instance.createAccount([8,"543543",0,false],{from: accounts[0]});
            await instance.depositMoney(8,{
                from: accounts[8],
                value: web3.utils.toWei("3", "ether"),});
            //Redrawing money
            await instance.redrawMoney(8,10);
            assert(false);
        }catch (e) {
            assert.equal("You don't have enough money in your account to redraw.",e.reason)
        }

    });
        /*8) Realizar el testing solo el dueño del banco puede retirar todos los fondos a su billetera digital, dejando al
           banco sin fondos*/
//address(this).balance
    it("Solo el dueño del banco puede retirar los fondos", async()=>{
        try {
            await instance.withdrawAllMoney({from:accounts[9]});
        }catch (e) {
            assert.equal("You are not the owner.",e.reason)
        }
    });

})
