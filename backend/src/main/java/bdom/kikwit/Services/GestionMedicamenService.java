package bdom.kikwit.Services;

import bdom.kikwit.Dto.GestionMedicamentRequestDto;
import bdom.kikwit.Dto.GestionMedicamentResponseDto;

import java.util.List;

public interface GestionMedicamenService {
    GestionMedicamentResponseDto save(GestionMedicamentRequestDto requestDto);
    GestionMedicamentResponseDto update(Long id, GestionMedicamentRequestDto requestDto);
    GestionMedicamentResponseDto getOne(Long id);
    String delete(Long id);
    List<GestionMedicamentResponseDto> getAll();
}
