package bdom.kikwit.Mappers;

import bdom.kikwit.Dto.CategorieRequestDto;
import bdom.kikwit.Dto.CategorieResponseDto;
import bdom.kikwit.Entities.Categorie;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategorieMapper {

    CategorieResponseDto toCategorieResponseDto(Categorie categorie);
    Categorie fromCategorieRequestDto(CategorieRequestDto requestDto);
}
