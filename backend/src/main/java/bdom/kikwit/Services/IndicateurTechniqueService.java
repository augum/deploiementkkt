package bdom.kikwit.Services;

import bdom.kikwit.Dto.IndicateurTechniqueRequestDto;
import bdom.kikwit.Dto.IndicateurTechniqueResponseDto;

import java.util.List;

public interface IndicateurTechniqueService {
    IndicateurTechniqueResponseDto save(IndicateurTechniqueRequestDto requestDto);
    IndicateurTechniqueResponseDto update(Long id, IndicateurTechniqueRequestDto requestDto);
    String delete(Long id);
    List<IndicateurTechniqueResponseDto> getAll();
}
