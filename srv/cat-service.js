const cds = require('@sap/cds')
const { sendMail } = require('@sap-cloud-sdk/mail-client');

module.exports = async (srv) => {
    const { Books } = cds.entities
    srv.before('CREATE', "Books", async (req) => {
        if (req.data.stock < 10) {
            req.reject({
                message: 'stock is less than 10',
                status: 418
            })
        }
    })

    srv.on('CREATE', "Books", async (req, next) => {
        const uppercaseValue = req.data.title
        console.log(req.data);
        if (uppercaseValue !== undefined) {
            const dataModified = uppercaseValue.toUpperCase()
            console.log(dataModified);
            await INSERT({ ID: req.data.ID, title: dataModified, stock: req.data.stock }).into(Books);

            const modifiedData = {
                ID: req.data.ID,
                title: dataModified,
                stock: req.data.stock
            };
            return modifiedData;
        }
        next();
        return req.data
    })

    srv.after('CREATE', "Books", async (req, data) => {
        // we will send an email to state that create operation has performed successfully
        console.log('CREATE operation completed successfully');
        const mailConfig = {
            to: 'ahmet.demirlicakmak@aarini.com',
            subject: 'Test Destination From BTP',
            text: 'If you receive this e-mail, you are successful.'
        };
        sendMail({ destinationName: 'testmail' }, [mailConfig]);
    })

    srv.on("sendMailWithAction", async (req) => {
        const mailConfig = {
          to: 'ahmet.demirlicakmak@aarini.com',
          subject: 'Test Action',
          text: 'If you receive this e-mail, you are successful.'
        };
        sendMail({ destinationName: 'testmail' }, [mailConfig]);
      });
}
