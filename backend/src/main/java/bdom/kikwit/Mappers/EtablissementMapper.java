package bdom.kikwit.Mappers;

import bdom.kikwit.Dto.EtablissementRequestDto;
import bdom.kikwit.Dto.EtablissementResponseDto;
import bdom.kikwit.Entities.Etablissement;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface EtablissementMapper {

    EtablissementResponseDto toEtablissementResponseDto(Etablissement etablissement);
    Etablissement fromEtablissementRequestDto(EtablissementRequestDto requestDto);
}
