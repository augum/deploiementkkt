package bdom.kikwit.Services;

import bdom.kikwit.Dto.SourceEnergieRequestDto;
import bdom.kikwit.Dto.SourceEnergieResponseDto;

import java.util.List;

public interface SourceEnergieService {
    SourceEnergieResponseDto save(SourceEnergieRequestDto requestDto);
    SourceEnergieResponseDto update(Long id, SourceEnergieRequestDto requestDto);
    List<SourceEnergieResponseDto> getAll();
    String delete(Long id);
}
