package bdom.kikwit.Mappers;

import bdom.kikwit.Dto.UtilisateurRequestDto;
import bdom.kikwit.Dto.UtilisateurResponseDto;
import bdom.kikwit.Entities.Utilisateur;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UtilisateurMapper {
    UtilisateurResponseDto toUtilisateurResponseDto(Utilisateur utilisateur);
    Utilisateur fromUtilisateurRequestDto(UtilisateurRequestDto requestDto);
}
