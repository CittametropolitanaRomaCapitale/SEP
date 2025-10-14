package it.parsec326.pi.intranet.model;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import io.smallrye.common.constraint.NotNull;
import it.parsec326.pi.intranet.utils.NullAwareBeanUtilsBean;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.beanutils.BeanUtilsBean;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.util.*;
import java.util.stream.Collectors;

@Getter
@MappedSuperclass
public abstract class PanacheCustomEntity extends PanacheEntityBase {

    @Id
    @SequenceGenerator(name = "hibernate_sequence", sequenceName = "hibernate_sequence_pi", allocationSize = 1, initialValue = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE,  generator = "hibernate_sequence")
    @Setter
    public Long id;

    public PanacheCustomEntity() {}


    public String getMetaType(){
        return this.getClass().getSimpleName();
    }

    public void nullAvoidBeanUtilsCopy(PanacheCustomEntity insert) {

        BeanUtilsBean notNull= new NullAwareBeanUtilsBean();
        try {
            notNull.copyProperties(this, insert);
        } catch (IllegalAccessException | InvocationTargetException e) {
            e.printStackTrace();
        }

    }

    public void nullAvoidUpdateWithoutPersist(PanacheCustomEntity insert) {

        BeanUtilsBean notNull = new NullAwareBeanUtilsBean();
        try {
            notNull.copyProperties(this, insert);
        } catch (IllegalAccessException | InvocationTargetException e) {
            e.printStackTrace();
        }
    }



        public void nullAvoidUpdate(PanacheCustomEntity insert) {

        BeanUtilsBean notNull=new NullAwareBeanUtilsBean();
        try {
            notNull.copyProperties(this, insert);
        } catch (IllegalAccessException | InvocationTargetException e) {
            e.printStackTrace();
        }

        PanacheCustomEntity.persist(this);
        PanacheCustomEntity.flush();


//        List<Field> fields = Arrays.stream(insert.getClass().getDeclaredFields())
//                .collect(Collectors.toList());
//
//        if (!insert.getClass().getSuperclass().equals(PanacheCustomEntity.class)){
//            fields.addAll(Arrays.asList(insert.getClass().getSuperclass().getDeclaredFields()));
//        }
//
//        Map<String, Object> params = new HashMap<>();
//        params.put("id", id);
//
//
//        String query = "update " + this.getClass().getAnnotation(Entity.class).name() + " set " + fields.parallelStream()
//                .filter(f -> !f.getName().startsWith("$"))
//                .filter(f -> {
//                    if (f.trySetAccessible()) {
//                        try {
//                            Object value = f.get(insert);
//                            if (value != null && !PanacheCustomEntity.class.isAssignableFrom(f.getType())) {
//                                params.put(f.getName(), value);
//                                return true;
//                            }
//                        } catch (Exception e) {
//                            e.printStackTrace();
//                        }
//                    }
//                    return false;
//                }).map(f -> f.getName() + " = :" + f.getName())
//                .collect(Collectors.joining(", ")).concat(" where id = :id");
//
//        log.debug("query: " + query);
//        log.debug("params: " + params);
//        if(params.size() > 1) {
//            update(query, params);
//            getEntityManager().refresh(this);
//        } else {
//            log.info("No params to update found, no operation will be performed.");
//        }
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
//                    log.debug("Field : " + f.getName() + " is accessible : " + f.trySetAccessible());
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
