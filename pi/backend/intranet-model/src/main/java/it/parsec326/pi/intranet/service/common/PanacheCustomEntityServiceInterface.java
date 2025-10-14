package it.parsec326.pi.intranet.service.common;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import it.parsec326.pi.intranet.exception.CustomException;
import it.parsec326.pi.intranet.exception.ExceptionChecked;
import it.parsec326.pi.intranet.model.PanacheCustomEntity;
import it.parsec326.pi.intranet.utils.SortInput;
import jakarta.transaction.SystemException;
import jakarta.transaction.UserTransaction;
import org.apache.commons.lang3.exception.ExceptionUtils;

/**
 * PanacheEntityServiceInterface is a new interface that extends ServiceInterface and provide default methods.
 * If the entity isn't a PanacheCustomEntity then you might implement ServiceInterface instead and implement manually your methods.
 * Thanks to PanacheEntityServiceInterface a service hasn't to be implemented if all service's methods are default.
 * The quite most overrided servcie method is getFindAllQuery that provides the PanacheQuery to the findAll and countPages.
 * So scope of this Interface is to write less code and override and implement only the service's methods that has to do so,ething different from default written here.
 */

public interface PanacheCustomEntityServiceInterface<T extends PanacheCustomEntity> extends ServiceInterface<T> {

    PanacheQuery<T> getFindAllQuery(String search, SortInput sort);

    PanacheQuery<T> getFindByIdQuery(Long id);

//    @Override
//    @ExceptionChecked
//    default T save(T insert) {
//        UserTransaction transaction = getTransaction();
//        try {
//            transaction.begin();
//            insert.persistAndFlush();
//            transaction.commit();
//        } catch (Exception e) {
//            System.out.println(ExceptionUtils.getStackTrace(e));
//            // do something on Tx failure
//            try {
//                transaction.rollback();
//            } catch (SystemException ex) {
//                System.out.println(ExceptionUtils.getStackTrace(ex));
//            }
//            CustomException.get(CustomException.ErrorCode.INTERNAL, e).boom();
//        }
//        return insert;
//    }

    /**
     * Questo override del metodo update prevede un metodo più moderno e legato alla gestione delle transazioni con quarkus
     * La gestione della transaction è definita nella annotation definita sulla firma del metodo.
     * TODO: continuare a testare accuratamente e verificare che ci sia tutto il necessario in caso di errori
     * */
    @Override
    @ExceptionChecked
    default T save(T insert) {
        insert.persistAndFlush();
        return insert;
    }

//    @Override
//    @ExceptionChecked
//    default T update(Long id, T insert) {
//        UserTransaction transaction = getTransaction();
//        T entity = null;
//        try {
//            transaction.begin();
//            entity = findById(id);
//            entity.nullAvoidUpdate(insert);
//            transaction.commit();
//        } catch (Exception e) {
//            System.out.println(ExceptionUtils.getStackTrace(e));
//            // do something on Tx failure
//            try {
//                transaction.rollback();
//            } catch (SystemException ex) {
//                System.out.println(ExceptionUtils.getStackTrace(ex));
//            }
//            CustomException.get(CustomException.ErrorCode.INTERNAL, e).boom();
//        }
//        return entity;
//    }

    /**
     * Questo override del metodo update prevede un metodo più moderno e legato alla gestione delle transazioni con quarkus
     * La gestione della transaction è definita nella annotation definita sulla firma del metodo.
     *  * TODO: continuare a testare accuratamente e verificare che ci sia tutto il necessario in caso di errori
     * */
    @Override
    @ExceptionChecked
    default T update(Long id, T insert) {
        T entity = findById(id);
        entity.nullAvoidUpdate(insert);
        return entity;
    }


    // TODO: Implementare la nuova gestione delle transazioni anche con il delete
    @Override
    @ExceptionChecked
    default boolean delete(Long id) {
        UserTransaction transaction = getTransaction();
        try {
            transaction.begin();
            T entity = findById(id);
            entity.delete();
            transaction.commit();
            return true;
        } catch (Exception e) {
            System.out.println(ExceptionUtils.getStackTrace(e));
            // do something on Tx failure
            try {
                transaction.rollback();
            } catch (SystemException ex) {
                System.out.println(ExceptionUtils.getStackTrace(ex));
            }
            CustomException.get(CustomException.ErrorCode.INTERNAL, e).boom();
        }
        return false;
    }
}
