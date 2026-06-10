package bdom.kikwit.Mappers;

import bdom.kikwit.Dto.IndicateurTechniqueRequestDto;
import bdom.kikwit.Dto.IndicateurTechniqueResponseDto;
import bdom.kikwit.Entities.IndicateurTechnique;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface IndicateurTechniqueMapper {
    IndicateurTechniqueResponseDto toIndicateurTechniqueResponseDto(IndicateurTechnique indicateurTechnique);
    IndicateurTechnique fromIndicateurTechniqueRequestDto(IndicateurTechniqueRequestDto requestDto);

}
