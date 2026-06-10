package bdom.kikwit.Services;

import bdom.kikwit.Dto.EtablissementRequestDto;
import bdom.kikwit.Dto.EtablissementResponseDto;

import java.util.List;

public interface EtablissementService {
    EtablissementResponseDto save(EtablissementRequestDto requestDto);
    EtablissementResponseDto update(Long id, EtablissementRequestDto requestDto);
    EtablissementResponseDto getOne(Long id);
    String delete(Long id);
    List<EtablissementResponseDto> getAll();
}
