package bdom.kikwit.Mappers;

import bdom.kikwit.Dto.GestionMedicamentRequestDto;
import bdom.kikwit.Dto.GestionMedicamentResponseDto;
import bdom.kikwit.Entities.GestionMedicament;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface GestionMedMapper {
    GestionMedicamentResponseDto toGestionMedicamentResponseDto(GestionMedicament gestionMedicament);
    GestionMedicament fromGestionMedicamentRequestDto(GestionMedicamentRequestDto requestDto);
}
