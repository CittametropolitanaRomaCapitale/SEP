package it.parsec326.pi.intranet.service.common;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Page;
import it.parsec326.pi.intranet.exception.ExceptionChecked;
import it.parsec326.pi.intranet.utils.SortInput;
import jakarta.transaction.UserTransaction;

import java.util.List;


public interface ServiceInterface<T> {


    @ExceptionChecked
    default List<T> findAll(String search, int page, int size, SortInput sort){
        return getFindAllQuery(search, sort).page(Page.of(page, size)).list();
    }

    @ExceptionChecked
    default int countPages(String search, int size){
        return getPagesCount(getFindAllQuery(search, null).count(), size);
    }

    @ExceptionChecked
    default T findById(Long id){
        return getFindByIdQuery(id).firstResult();
    }

    T save(T insert);

    T update(Long id, T insert);

    boolean delete(Long id);

    default int getPagesCount(long count, double size){
        return (int) Math.ceil(count == 0 ? 0 : count / size);
    }

    PanacheQuery<T> getFindAllQuery(String search, SortInput sort);

    PanacheQuery<T> getFindByIdQuery(Long id);

    default String getParsedSearchParam(String search){
        return search.isBlank() ? "" : ("%" + search + "%");
    }

    UserTransaction getTransaction();

}
