package bdom.kikwit.Services;

import bdom.kikwit.Dto.PersonnelRequestDto;
import bdom.kikwit.Dto.PersonnelResponseDto;

import java.util.List;

public interface PersonnalService {
    PersonnelResponseDto save(PersonnelRequestDto requestDto);
    PersonnelResponseDto update(Long id, PersonnelRequestDto requestDto);
    String delete(Long id);
    List<PersonnelResponseDto> getAll();
}
