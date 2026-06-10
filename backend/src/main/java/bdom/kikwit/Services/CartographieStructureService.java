package bdom.kikwit.Services;

import bdom.kikwit.Dto.CartographieStructureRequestDto;
import bdom.kikwit.Dto.CartographieStructureResponseDto;
import bdom.kikwit.Dto.CategorieRequestDto;

import java.util.List;

public interface CartographieStructureService{

    CartographieStructureResponseDto save(CartographieStructureRequestDto requestDto);
    CartographieStructureResponseDto update(Long id, CartographieStructureRequestDto requestDto);
    CartographieStructureResponseDto getOne(Long id);
    String delete(Long id);
    List<CartographieStructureResponseDto> liste();
}
