package it.parsec326.pi.intranet.service;


import io.quarkus.test.junit.QuarkusTest;
import it.parsec326.pi.intranet.dto.input.AnagraficaInput;
import it.parsec326.pi.intranet.mapper.AnagraficaMapper;
import it.parsec326.pi.intranet.model.Anagrafica;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

@QuarkusTest
class AnagraficaTest {

  AnagraficaService anagraficaService;

  Anagrafica contattoAnagrafica = mock(Anagrafica.class);
  AnagraficaMapper anagraficaMapperMock = mock(AnagraficaMapper.class);

  @BeforeEach
  void setUp() throws Exception {
    anagraficaService = new AnagraficaService();
    this.setField(anagraficaService, "anagraficaMapper", anagraficaMapperMock);
  }

  private void setField(Object targetObject, String fieldName, Object value) throws Exception {
    Field field = targetObject.getClass().getDeclaredField(fieldName);
    field.setAccessible(true);
    field.set(targetObject, value);
  }
  @Test
  @Transactional
  void saveContatto_insertsSuccessfully() {
    AnagraficaInput input = new AnagraficaInput();
    input.setCfPiva("CFP99999999");

    when(contattoAnagrafica.getCfPiva()).thenReturn("CFP99999999");
    doNothing().when(contattoAnagrafica).persistAndFlush();
    doReturn(contattoAnagrafica).when(anagraficaMapperMock).toEntity(any(AnagraficaInput.class));
    assertNotNull(anagraficaService.saveContattoInput(input));
  }
}