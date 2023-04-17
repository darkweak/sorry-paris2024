const firstname = 'John'
const lastname = 'Doe'
const password = '^MyAwes0mePassw0rd$'
const experience = `Je souhaiterais partager avec vous mes expériences en tant que bénévole dans des événements sportifs internationaux. J'ai eu l'opportunité de travailler avec des organisations prestigieuses et de contribuer à la réalisation d'événements sportifs de grande envergure.

J'ai commencé ma carrière de bénévole dans le domaine sportif lors des Jeux Olympiques de la Jeunesse à [ville/pays] en [année]. J'ai travaillé pendant deux semaines en tant qu'assistant de billetterie, assistant les spectateurs et coordonnant les bénévoles. Cette expérience m'a permis de découvrir l'envers du décor des Jeux Olympiques.

Plus tard, j'ai travaillé en tant que bénévole lors des Championnats du Monde de [sport] à [ville/pays] en [année]. J'ai aidé à la mise en place et à la gestion de l'événement, en coordonnant les activités des bénévoles, en gérant la logistique pour les athlètes et en créant un environnement sûr et agréable pour les spectateurs.

Enfin, j'ai travaillé en tant que bénévole lors des Jeux Paralympiques de [année] à [ville/pays]. J'ai travaillé en tant qu'assistant personnel pour les athlètes, en les aidant dans leurs déplacements et en veillant à ce qu'ils aient tout ce dont ils avaient besoin pour performer.

Ces expériences de bénévolat ont été très enrichissantes et m'ont permis de découvrir le monde du sport à un niveau plus profond. J'ai appris à travailler en équipe, à gérer des situations de stress et à être à l'écoute des besoins des autres. Je suis fier d'avoir contribué à ces événements sportifs internationaux et je suis reconnaissant pour les amitiés que j'ai nouées avec les athlètes, les bénévoles et les organisateurs.

Je vous remercie de prendre le temps de lire cette lettre et je reste à votre disposition pour toute information supplémentaire.`

const why = `Je suis ravi(e) de vous présenter ma candidature en tant que bénévole pour l'organisation des Jeux Olympiques. Depuis mon plus jeune âge, j'ai été passionné(e) par le sport et je crois que les Jeux Olympiques sont l'apogée de la compétition sportive.

Je suis convaincu(e) que travailler comme bénévole pour l'organisation des Jeux Olympiques sera une expérience incroyablement enrichissante. J'ai déjà eu la chance de travailler en tant que bénévole lors de grands événements sportifs, notamment les Championnats du Monde de [sport] en [année] et les Jeux Paralympiques de [année]. Ces expériences m'ont permis de découvrir l'envers du décor de ces événements, de rencontrer des personnes du monde entier et de développer des compétences en matière de travail en équipe.

Je suis convaincu(e) que mes compétences et mon expérience me permettront d'être un(e) bénévole efficace pour les Jeux Olympiques. J'ai une grande capacité à travailler sous pression et je suis capable de m'adapter rapidement aux changements. Je suis également très à l'aise pour communiquer avec les autres, ce qui est essentiel pour travailler efficacement dans une équipe.

Je suis également passionné(e) par les aspects logistiques des événements sportifs. J'ai acquis une expérience en matière de coordination des bénévoles, de gestion de la logistique pour les athlètes et de création d'un environnement sûr et agréable pour les spectateurs. Je suis convaincu(e) que ces compétences seront très utiles pour travailler comme bénévole pour les Jeux Olympiques.

Enfin, je suis disponible pour travailler pendant toute la durée des Jeux Olympiques et je suis prêt(e) à travailler de longues heures pour contribuer à la réussite de l'événement.

Je vous remercie de prendre le temps de lire ma candidature et je suis impatient(e) de contribuer à l'organisation des Jeux Olympiques en tant que bénévole.`


const clickOnContinuer = () => {
    cy.get('input[value="Continuer"]').click({ force: true });
}
const clickOnConfirm = () => {
    cy.get('input[value="Je confirme"]').click({ force: true });
}
const nextPage = () => {
    cy.get('#buttonsRight > button[aria-label^="Éta"]').click();
}

const getRandom = (max) => Math.floor(Math.random() * max);

const formatNumber = (nbr) => nbr < 10 ? `0${nbr}` : nbr;

describe('Apply as candidate', () => {
    it('Should get the email', () => {
        cy.visit('https://www.emailnator.com');
        cy.get('button[name="goBtn"]').click();

        cy.url().then(url => cy.task('setEmail', url.split('#')[1]));
    });

    it('Should display the portal page', () => {
        cy.visit('https://volontaire.paris2024.org/vportal/profile');
        cy.task('getEmail').then(email => cy.get('input[id^="gigya-textbox-"]').type(email));
        clickOnContinuer();
        cy.get('input[id^="gigya-textbox-"][name="profile.firstName"]').type(firstname);
        cy.get('input[id^="gigya-textbox-"][name="profile.lastName"]').type(lastname);
        cy.get('input[id^="gigya-password-"]').type(password);
        cy.get('label[for^="gigya-checkbox-"]').click({ force: true });
        clickOnContinuer();
        cy.url().then(url => cy.task('setClientId', new URLSearchParams(`?${url.split('?')[1]}`).get('client_id')));
        cy.wait(5000);
    });

    it('Should get the email', () => {
        cy.task('getEmail').then(email => cy.visit('https://www.emailnator.com/inbox/#'+email));
        cy.wait(10000);
        cy.get('button[name="reload"]').click();

        cy.get('table.message_container > tbody > tr').eq(1, { timeout: 10000 }).click()
        cy.get('[style="font-family:\'TradeGothic\', Arial; font-weight:bold; font-size:37px; margin:0 0 30px 0; padding:0;"]').invoke('text').then(code => cy.task('setCode', code.trim()))
    });

    it('Return to refill email, password and fill the code', () => {
        cy.visit(`https://volontaire.paris2024.org/vportal/profile`,{
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0',
            }});
        cy.task('getEmail').then(email => cy.get('input[id^="gigya-textbox-"]').type(email));
        clickOnContinuer();
        cy.wait(5000);
        cy.get('input[id^="gigya-password-"]').type(password);
        cy.get('input[value="Connexion"]').click();
        cy.wait(5000);

        // Stuck here ATM, the code is filled but they consider it as stale or invalid.
        cy.task('getCode').then(code => cy.get('input[id^="gigya-textbox-"]').first().type(code.trim()));
        cy.wait(5000);
        cy.get('input[value="Vérifier"]').click();
        clickOnContinuer();

        const genderPlace = getRandom(3);
        cy.get('input[id^="gigya-multiChoice-"]').eq(genderPlace).click()

        const month = formatNumber(getRandom(12) + 1);
        const day = formatNumber(getRandom(27) + 1);
        const year = getRandom(30) + 1973;
        const zone = getRandom(19) + 1;
        const postcode = `750${formatNumber(zone)}`;
        cy.get('input[id^="gigya-textbox-"]').first().type(`${year}-${month}-${day}`);
        cy.get('input[id^="gigya-textbox-"]').last().type(postcode);
        cy.get('select[aria-label="Code du pays"]').select('+33');

        const phoneStr = `${getRandom(1) + 6}${formatNumber(getRandom(99) + 1)}${formatNumber(getRandom(99) + 1)}${formatNumber(getRandom(99) + 1)}${formatNumber(getRandom(99) + 1)}`;
        cy.get('fieldset[type="gigya-phone-number-input"][data-display-name="Téléphone mobile"] > input').type(phoneStr);
        clickOnContinuer();
        clickOnConfirm();

        cy.get('.linkStartApp').first().click();

        // Personal informations
        cy.get('#combo8_dropDown').click();
        cy.get('react-select-2-listbox > div[id^=react-select-2-option-]').eq(genderPlace == 0 ? 1 : genderPlace == 1 ? 0 : 2).click();
        cy.get('#BirthDate').type(`${day}${month}${year}`);
        cy.get('#combo10_dropDown').click();
        cy.get('#react-select-3-option-61').click();

        // Home
        cy.get('#combo11_dropDown').click();
        cy.get('#react-select-4-option-64').click();
        cy.get('#combo13_dropDown').click();
        const computedZone = 4793+zone;
        cy.get(`#react-select-48-option-${computedZone}`).click();
        cy.get('#1648794618115_ext_1055').type('Paris');
        cy.get('#combo15_dropDown').click();
        cy.get(`#react-select-6-option-${computedZone}`).click();

        // Uniform
        const sizePosition = getRandom(8)
        cy.get('#combo17_dropDown').click();
        cy.get(`#react-select-7-option-${sizePosition}`).click();
 
        cy.get('#combo18_dropDown').click();
        cy.get(`#react-select-8-option-${sizePosition}`).click();

        cy.get('#combo19_dropDown').click();
        cy.get(`#react-select-9-option-${getRandom(12)}`).click();

        cy.get('#combo20_dropDown').click();
        cy.get(`#react-select-10-option-${getRandom(3)}`).click();


        // Need
        cy.get('#combo22_dropDown').click();
        cy.get(`#react-select-11-option-1`).click();
        nextPage();

        cy.get('#PhoneCellNumber').type(phoneStr);
        cy.get('#combo41_dropDown').click();
        cy.get('#react-select-13-option-1').click();
        nextPage();
        
        // Languages
        cy.get('#combo44_dropDown').click();
        cy.get('#react-select-14-option-5').click();

        cy.get('#combo46_dropDown').click();
        cy.get(`#react-select-15-option-${getRandom(3) + 3}`).click();

        // Additional languages
        cy.get('#combo53_dropDown').click();
        cy.get(`#react-select-16-option-${getRandom(70)}`).click();
        
        // Knowledges
        cy.get('#combo54_dropDown').click();
        cy.get(`#react-select-17-option-${getRandom(3) + 3}`).click();
        
        // Experiences
        cy.get('#combo68_dropDown').click();
        cy.get(`#react-select-20-option-0`).click();
        
        cy.get('#combo70_dropDown').click();
        cy.get(`#react-select-49-option-${getRandom(11)}`).click();
        
        cy.get('textarea').first().type(experience);
        
        // Medic
        cy.get('#combo75_dropDown').click();
        cy.get(`#react-select-21-option-1`).click();
        
        // Horse
        cy.get('#combo84_dropDown').click();
        cy.get(`#react-select-22-option-1`).click();
        
        // Driver licences
        cy.get('#combo92_dropDown').click();
        cy.get(`#react-select-23-option-0`).click();
        
        cy.get('#combo93_dropDown').click();
        cy.get(`#react-select-63-option-64`).click();
        
        cy.get('#combo94_dropDown').click();
        cy.get(`#react-select-64-option-${getRandom(83)}`).click();
        
        cy.get('#combo95_dropDown').click();
        cy.get(`#react-select-24-option-1`).click();
        nextPage();

        // Program choice
        cy.get('#combo100_dropDown').click();
        const candidateTo = getRandom(3)
        cy.get(`#react-select-25-option-${candidateTo}`).click();
        switch (candidateTo) {
            case 0:
                cy.get('#combo101_dropDown').click();
                cy.get('#react-select-76-option-2').click();
                break;
            case 2:
                cy.get('#combo102_dropDown').click();
                cy.get('#react-select-77-option-2').click();
        }
        
        cy.get('#combo105_dropDown').click();
        cy.get(`#react-select-26-option-0`).click();
        cy.get('#combo106_dropDown').click();
        cy.get(`#react-select-79-option-${getRandom(2) + 2}`).click();
        cy.get('#combo107_dropDown').click();
        cy.get(`#react-select-27-option-0`).click();
        cy.get('#combo108_dropDown').click();
        cy.get(`#react-select-80-option-${getRandom(2) + 2}`).click();


        cy.get('#combo110_dropDown').click();
        cy.get(`#react-select-28-option-0`).click();

        // Cities
        cy.get('#combo111_dropDown').click();
        cy.get(`#react-select-81-option-${getRandom(1)}`).click();
        cy.get('#combo112_dropDown').click();
        cy.get(`#react-select-82-option-${getRandom(1)}`).click();
        cy.get('#combo113_dropDown').click();
        cy.get(`#react-select-83-option-${getRandom(1)}`).click();
        cy.get('#combo114_dropDown').click();
        cy.get(`#react-select-84-option-${getRandom(1)}`).click();
        cy.get('#combo115_dropDown').click();
        cy.get(`#react-select-85-option-${getRandom(1)}`).click();
        cy.get('#combo116_dropDown').click();
        cy.get(`#react-select-86-option-${getRandom(1)}`).click();
        cy.get('#combo117_dropDown').click();
        cy.get(`#react-select-87-option-${getRandom(1)}`).click();
        cy.get('#combo118_dropDown').click();
        cy.get(`#react-select-88-option-${getRandom(1)}`).click();
        cy.get('#combo119_dropDown').click();
        cy.get(`#react-select-89-option-${getRandom(1)}`).click();
        cy.get('#combo120_dropDown').click();
        cy.get(`#react-select-90-option-${getRandom(1)}`).click();
        cy.get('#combo121_dropDown').click();
        cy.get(`#react-select-91-option-${getRandom(1)}`).click();

        // Places
        cy.get('#combo124_dropDown').click();
        cy.get(`#react-select-29-option-${getRandom(1)}`).click();
        cy.get('#combo125_dropDown').click();
        cy.get(`#react-select-30-option-${getRandom(1)}`).click();
        cy.get('#combo126_dropDown').click();
        cy.get(`#react-select-31-option-${getRandom(1)}`).click();
        cy.get('#combo127_dropDown').click();
        cy.get(`#react-select-32-option-${getRandom(1)}`).click();
        cy.get('#combo128_dropDown').click();
        cy.get(`#react-select-33-option-${getRandom(1)}`).click();
        cy.get('#combo129_dropDown').click();
        cy.get(`#react-select-34-option-${getRandom(1)}`).click();
        cy.get('#combo130_dropDown').click();
        cy.get(`#react-select-35-option-${getRandom(1)}`).click();
        cy.get('#combo131_dropDown').click();
        cy.get(`#react-select-36-option-${getRandom(1)}`).click();
        cy.get('#combo132_dropDown').click();
        cy.get(`#react-select-37-option-${getRandom(1)}`).click();
        cy.get('#combo133_dropDown').click();
        cy.get(`#react-select-38-option-${getRandom(1)}`).click();
        cy.get('#combo134_dropDown').click();
        cy.get(`#react-select-39-option-${getRandom(1)}`).click();
        
        cy.get('textarea').eq(1).type(experience);
        nextPage();

        cy.get('.nextStep').click();
        cy.get('#checkbox-default').click();
        cy.get('button[aria-label="Je continue"]').click();

        for (let i = 0; i < 90; i++) {
            cy.get(`button[id^="response${getRandom(1) + 1}"]`).click();
        }
        cy.get('button[id^="response1"]').click()
        for (let i = 0; i < 90; i++) {
            cy.get(`button[id^="response${getRandom(1) + 1}"]`).click();
        }
        cy.get('#checkbox-default').click();
        cy.get('button.link__default.link__default--pink').first().click();
        cy.wait(5000)
        nextPage();

        cy.get('input[type="checkbox"]').first().click();
        cy.get('input[type="checkbox"]').eq(1).click();
        cy.get('button.btn-green').click();
        cy.wait(5000);
        cy.get('button.btn-green').last().click();
        cy.get('div.buttonSecondSummary > button').last().click();
    });
})
