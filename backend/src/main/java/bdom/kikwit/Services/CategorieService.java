package bdom.kikwit.Services;

import bdom.kikwit.Dto.CategorieRequestDto;
import bdom.kikwit.Dto.CategorieResponseDto;

import java.util.List;

public interface CategorieService {

    CategorieResponseDto save(CategorieRequestDto requestDto);
    CategorieResponseDto update(Long id, CategorieRequestDto requestDto);
    CategorieResponseDto getOne(Long id);
    String delete(Long id);
    List<CategorieResponseDto> getAll();
}
