using my.bookshop as my from '../db/data-model';

service AariniService {
    entity Books as projection on my.Books;
    action sendMailWithAction();
}