package bdom.kikwit.Mappers;

import bdom.kikwit.Dto.SourceEnergieRequestDto;
import bdom.kikwit.Dto.SourceEnergieResponseDto;
import bdom.kikwit.Entities.SourceEnergie;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SourceEnergieMapper {
    SourceEnergieResponseDto toSourceEnergieResponseDto(SourceEnergie sourceEnergie);
    SourceEnergie fromSourceEnergieRequestDto(SourceEnergieRequestDto requestDto);
}
