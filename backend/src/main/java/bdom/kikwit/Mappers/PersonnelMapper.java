package bdom.kikwit.Mappers;

import bdom.kikwit.Dto.PersonnelRequestDto;
import bdom.kikwit.Dto.PersonnelResponseDto;
import bdom.kikwit.Entities.Personnel;
import org.mapstruct.Mapper;

@Mapper (componentModel = "spring")
public interface PersonnelMapper {
    PersonnelResponseDto toPersonnelResponseDto(Personnel personnel);
    Personnel fromPersonnelRequestDto(PersonnelRequestDto requestDto);
}
