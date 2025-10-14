package it.cmrc.sso.entity.common;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import io.smallrye.common.constraint.NotNull;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.beanutils.BeanUtilsBean;

import javax.persistence.*;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.util.*;
import java.util.stream.Collectors;

@MappedSuperclass
@Slf4j
public abstract class PanacheCustomEntity extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    public Long id;

    public PanacheCustomEntity() {}


    public void nullAvoidUpdate(PanacheCustomEntity insert) {

        BeanUtilsBean notNull=new NullAwareBeanUtilsBean();
        try {
            notNull.copyProperties(this, insert);
        } catch (IllegalAccessException | InvocationTargetException e) {
            e.printStackTrace();
        }

        PanacheCustomEntity.persist(this);
        PanacheCustomEntity.flush();

    }

    public void nullAvoidCopy(PanacheCustomEntity insert) {
        List<Field> fields = Arrays.stream(insert.getClass().getDeclaredFields())
                .collect(Collectors.toList());
        if (!insert.getClass().getSuperclass().equals(PanacheCustomEntity.class)){
            fields.addAll(Arrays.asList(insert.getClass().getSuperclass().getDeclaredFields()));
        }

        Map<String, Field> thisFields = new HashMap<>();

        Arrays.stream(this.getClass().getDeclaredFields()).parallel()
                .forEach(f -> thisFields.put(f.getName(), f));
        if (!this.getClass().getSuperclass().equals(PanacheCustomEntity.class)){
            Arrays.stream(this.getClass().getSuperclass().getDeclaredFields()).parallel()
                    .forEach(f -> thisFields.put(f.getName(), f));
        }



        fields.parallelStream()
                .filter(f -> !f.getName().startsWith("$"))
                .forEach(f -> {
                    if (f.trySetAccessible()) {
                        try {
                            Optional.ofNullable(f.get(insert))
                                    .ifPresent(o -> {
                                        Field thisField = thisFields.get(f.getName());
                                        if (thisField.trySetAccessible()) {
                                            try {
                                                thisField.set(this, o);
                                            } catch (IllegalAccessException e) {
                                                e.printStackTrace();
                                            }
                                        }
                                    });
                        } catch (IllegalAccessException e) {
                            e.printStackTrace();
                        }
                    }
                });
    }

    public void nullAvoidCopy(PanacheCustomEntity insert, List<String> skipFields) {
        List<Field> fields = Arrays.stream(insert.getClass().getDeclaredFields())
                .collect(Collectors.toList());
        if (!insert.getClass().getSuperclass().equals(PanacheCustomEntity.class)){
            fields.addAll(Arrays.asList(insert.getClass().getSuperclass().getDeclaredFields()));
        }

        Map<String, Field> thisFields = new HashMap<>();

        Arrays.stream(this.getClass().getDeclaredFields()).parallel()
                .forEach(f -> thisFields.put(f.getName(), f));
        if (!this.getClass().getSuperclass().equals(PanacheCustomEntity.class)){
            Arrays.stream(this.getClass().getSuperclass().getDeclaredFields()).parallel()
                    .forEach(f -> thisFields.put(f.getName(), f));
        }

        fields.parallelStream()
                .filter(f -> !f.getName().startsWith("$"))
                .filter(f -> !skipFields.contains(f.getName()))
                .forEach(f -> {
                    log.debug("Field : " + f.getName() + " is accessible : " + f.trySetAccessible());
                    if (f.trySetAccessible()) {
                        try {
                            Optional.ofNullable(f.get(insert))
                                    .ifPresent(o -> {
                                        Field thisField = thisFields.get(f.getName());
                                        if (thisField.trySetAccessible()) {
                                            try {
                                                thisField.set(this, o);
                                            } catch (IllegalAccessException e) {
                                                e.printStackTrace();
                                            }
                                        }
                                    });
                        } catch (IllegalAccessException e) {
                            e.printStackTrace();
                        }
                    }
                });
    }

    public void localNullNullAvoidCopy(PanacheCustomEntity insert, @NotNull List<String> skipFields) {

        List<Field> fields = Arrays.stream(insert.getClass().getDeclaredFields())
                .collect(Collectors.toList());
        if (!insert.getClass().getSuperclass().equals(PanacheCustomEntity.class)){
            fields.addAll(Arrays.asList(insert.getClass().getSuperclass().getDeclaredFields()));
        }

        Map<String, Field> thisFields = new HashMap<>();

        Arrays.stream(this.getClass().getDeclaredFields()).parallel()
                .forEach(f -> thisFields.put(f.getName(), f));
        if (!this.getClass().getSuperclass().equals(PanacheCustomEntity.class)){
            Arrays.stream(this.getClass().getSuperclass().getDeclaredFields()).parallel()
                    .forEach(f -> thisFields.put(f.getName(), f));
        }


        fields.parallelStream()
                .filter(f -> !f.getName().startsWith("$"))
                .filter(f -> !skipFields.contains(f.getName()))
                .forEach(f -> {
                    if (f.trySetAccessible()) {
                        try {
                            Optional.ofNullable(f.get(insert))
                                    .ifPresent(o -> {
                                        Field thisField = thisFields.get(f.getName());
                                        if (thisField != null && thisField.trySetAccessible()) {
                                            try {
                                                if(thisField.get(this) == null) {
                                                    thisField.set(this, o);
                                                }
                                            } catch (IllegalAccessException e) {
                                                e.printStackTrace();
                                            }
                                        }
                                    });
                        } catch (IllegalAccessException e) {
                            e.printStackTrace();
                        }
                    }
                });
    }

    @Override
    public boolean equals(Object obj) {
        return this.getClass().equals(obj.getClass()) && this.hashCode() == obj.hashCode();
    }

    @Override
    public int hashCode() {
        List<Field> fields = Arrays.stream(this.getClass().getDeclaredFields())
                .collect(Collectors.toList());
        fields.addAll(Arrays.asList(PanacheCustomEntity.class.getDeclaredFields()));

        List<Object> fieldsData = fields.parallelStream()
                .filter(f -> !f.getName().startsWith("$"))
                .map(f -> {
                    try {
                        if (f.trySetAccessible()) {
                            return f.get(this);
                        }
                    } catch (IllegalAccessException e) {
                        e.printStackTrace();
                    }
                    return null;
                }).filter(Objects::nonNull)
                .collect(Collectors.toList());

        fieldsData.add(id);

        return Objects.hash(fieldsData);
    }

    @Override
    public String toString() {
        List<Field> fields = Arrays.stream(this.getClass().getDeclaredFields())
                .collect(Collectors.toList());
        fields.addAll(Arrays.asList(PanacheCustomEntity.class.getDeclaredFields()));

        return this.getClass().getSimpleName() + "{" +
                "id=" + id + ", " +
                fields.parallelStream()
                        .filter(f -> !f.getName().startsWith("$"))
                        .map(f -> {
                            try {
                                if (f.trySetAccessible()) {
                                    return f.getName() + "=" + Optional.ofNullable(f.get(this))
                                            .map(Object::toString)
                                            .orElse(null);
                                }
                            } catch (IllegalAccessException e) {
                                e.printStackTrace();
                            }
                            return null;
                        }).filter(Objects::nonNull)
                        .collect(Collectors.joining(", ")) + '}';
    }

}
